const cloudbase = require('@cloudbase/node-sdk');
const { createHmac, randomUUID } = require('node:crypto');

const ARK_CHAT_COMPLETIONS_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const MAX_MESSAGE_LENGTH = 2000;
const MAX_OUTPUT_TOKENS = 220;
const REQUEST_TIMEOUT_MS = 12000;
const USAGE_COLLECTION = 'ai_gateway_usage';

const SYSTEM_PROMPT = `你是“心绪漫游小栈”的温和陪伴助手。回复要温和、简短、具体，不说教。
不要虚构用户信息；信息不足时要明确说明，并可提出一个简短的澄清问题。
不要进行心理或医学诊断，不要把回复描述为专业诊疗，也不要声称能够替代专业帮助。
不要承诺持续在线、永远陪伴或诱导用户依赖你。
如果用户提到自伤、自杀、正在发生的暴力或其他紧急危险，优先建议立即联系当地紧急服务，并联系身边可信任的人获得现实支持。不要提供未经核实的固定热线号码。`;

const CRISIS_REPLY = '我很担心你现在的安全。请立即联系你所在地的紧急服务，并联系一位能尽快来到你身边的可信任的人；如果可以，先远离可能伤害自己或他人的物品，去有人的安全地点。这里不能替代现实中的紧急帮助。';
const SAFE_FALLBACK_REPLY = '我愿意认真听你说，但我不能诊断或替代现实中的专业支持。我们可以先从你此刻最明显的感受开始；如果你正面临立即危险，请联系当地紧急服务和身边可信任的人。';

const CRISIS_PATTERN = /自杀|轻生|想死|不想活|结束生命|伤害自己|割腕|跳楼|服药自尽|活不下去|杀了(?:自己|他|她|别人)|hurt myself|kill myself|suicide|end my life/i;
const UNSAFE_REPLY_PATTERNS = [
  /(?:全国|国家|官方).{0,8}(?:心理|危机|援助|咨询)?热线/u,
  /(?:拨打|致电|热线).{0,12}\b\d{5,}\b/u,
  /(?:我会|让我)(?:一直|永远|始终).{0,8}(?:陪着你|等着你|守着你)/u,
  /你(?:患有|得了|就是|属于)(?:抑郁症|焦虑症|双相情感障碍|精神分裂症|创伤后应激障碍)/u
];

const BASE_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer'
};

function response(body, statusCode, requestId, headers = {}) {
  return {
    statusCode,
    headers: { ...BASE_HEADERS, ...headers },
    body: body === null ? '' : JSON.stringify({ ...body, requestId }),
    isBase64Encoded: false
  };
}

function errorResponse(error, statusCode, requestId, headers) {
  return response({ ok: false, error }, statusCode, requestId, headers);
}

function normalizeHeaders(headers = {}) {
  return Object.entries(headers).reduce((result, [name, value]) => {
    result[name.toLowerCase()] = Array.isArray(value) ? value.join(',') : String(value);
    return result;
  }, {});
}

function parseAllowedOrigins(value) {
  return new Set(String(value || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean));
}

function corsHeaders(origin, allowedOrigins) {
  if (!origin || !allowedOrigins.has(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin'
  };
}

function parsePositiveInteger(value) {
  if (!/^\d+$/.test(String(value || ''))) return null;
  const result = Number(value);
  return Number.isSafeInteger(result) && result > 0 ? result : null;
}

function parseRequestBody(event) {
  if (typeof event.body !== 'string') throw new Error('invalid_json');
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;
  return JSON.parse(rawBody);
}

function extractReply(data) {
  const content = data?.choices?.[0]?.message?.content;
  return typeof content === 'string' ? content.trim() : '';
}

function isUnsafeReply(reply) {
  return UNSAFE_REPLY_PATTERNS.some(pattern => pattern.test(reply));
}

function shanghaiDateKey(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

function anonymizeUserId(uid, secret) {
  return createHmac('sha256', secret).update(uid, 'utf8').digest('hex');
}

function documentData(result) {
  if (!result || !result.data) return null;
  return Array.isArray(result.data) ? result.data[0] || null : result.data;
}

async function reserveDailyUsage(database, uid, config, now) {
  const dateKey = shanghaiDateKey(now);
  const userHash = anonymizeUserId(uid, config.hashSecret);
  const globalId = `global_${dateKey}`;
  const userId = `user_${userHash}_${dateKey}`;

  return database.runTransaction(async transaction => {
    const collection = transaction.collection(USAGE_COLLECTION);
    const [globalResult, userResult] = await Promise.all([
      collection.doc(globalId).get(),
      collection.doc(userId).get()
    ]);
    const globalAttempts = Number(documentData(globalResult)?.attempts || 0);
    const userAttempts = Number(documentData(userResult)?.attempts || 0);

    if (globalAttempts >= config.globalLimit) return { allowed: false, reason: 'global' };
    if (userAttempts >= config.userLimit) return { allowed: false, reason: 'user' };

    const updatedAt = now.toISOString();
    await collection.doc(globalId).set({
      data: { scope: 'global', date: dateKey, attempts: globalAttempts + 1, updatedAt }
    });
    await collection.doc(userId).set({
      data: { scope: 'user', date: dateKey, attempts: userAttempts + 1, updatedAt }
    });
    return { allowed: true };
  });
}

function createHandler({ app, fetchImpl = fetch, now = () => new Date(), env = process.env }) {
  return async function handler(event = {}) {
    const requestId = randomUUID();
    const method = String(event.httpMethod || event.requestContext?.httpMethod || '').toUpperCase();
    const headers = normalizeHeaders(event.headers);
    const origin = headers.origin || '';
    const allowedOrigins = parseAllowedOrigins(env.AI_ALLOWED_ORIGINS);
    const cors = corsHeaders(origin, allowedOrigins);

    if (origin && !allowedOrigins.has(origin)) {
      return errorResponse('origin_not_allowed', 403, requestId);
    }

    if (method === 'OPTIONS') {
      return response(null, 204, requestId, cors);
    }

    if (method !== 'POST') {
      return errorResponse('method_not_allowed', 405, requestId, {
        ...cors,
        Allow: 'POST, OPTIONS'
      });
    }

    let uid = '';
    try {
      uid = app.auth().getUserInfo().uid || '';
    } catch {
      uid = '';
    }
    if (!uid) {
      return errorResponse('unauthorized', 401, requestId, cors);
    }

    let body;
    try {
      body = parseRequestBody(event);
    } catch {
      return errorResponse('invalid_json', 400, requestId, cors);
    }

    if (!body || typeof body.message !== 'string' || !body.message.trim()) {
      return errorResponse('invalid_message', 400, requestId, cors);
    }

    const message = body.message.trim();
    if (message.length > MAX_MESSAGE_LENGTH) {
      return errorResponse('message_too_long', 400, requestId, cors);
    }

    if (CRISIS_PATTERN.test(message)) {
      return response({ ok: true, reply: CRISIS_REPLY }, 200, requestId, cors);
    }

    const config = {
      apiKey: env.ARK_API_KEY,
      model: env.ARK_MODEL_ID,
      hashSecret: env.AI_USAGE_HASH_SECRET,
      userLimit: parsePositiveInteger(env.AI_DAILY_USER_LIMIT),
      globalLimit: parsePositiveInteger(env.AI_DAILY_GLOBAL_LIMIT)
    };
    if (!config.apiKey || !config.model || !config.hashSecret
      || !config.userLimit || !config.globalLimit || allowedOrigins.size === 0) {
      return errorResponse('service_unavailable', 503, requestId, cors);
    }

    let reservation;
    try {
      reservation = await reserveDailyUsage(app.database(), uid, config, now());
    } catch {
      return errorResponse('service_unavailable', 503, requestId, cors);
    }
    if (!reservation.allowed) {
      return reservation.reason === 'user'
        ? errorResponse('rate_limited', 429, requestId, cors)
        : errorResponse('service_unavailable', 503, requestId, cors);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const upstream = await fetchImpl(ARK_CHAT_COMPLETIONS_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: message }
          ],
          thinking: { type: 'disabled' },
          max_completion_tokens: MAX_OUTPUT_TOKENS,
          stream: false
        }),
        signal: controller.signal
      });

      if (!upstream.ok) {
        return errorResponse('upstream_unavailable', 502, requestId, cors);
      }

      let data;
      try {
        data = await upstream.json();
      } catch {
        return errorResponse('upstream_unavailable', 502, requestId, cors);
      }

      const reply = extractReply(data);
      if (!reply) {
        return errorResponse('upstream_unavailable', 502, requestId, cors);
      }

      return response({
        ok: true,
        reply: isUnsafeReply(reply) ? SAFE_FALLBACK_REPLY : reply
      }, 200, requestId, cors);
    } catch {
      return errorResponse('upstream_unavailable', 502, requestId, cors);
    } finally {
      clearTimeout(timeout);
    }
  };
}

const app = cloudbase.init({ env: cloudbase.SYMBOL_CURRENT_ENV });
exports.main = createHandler({ app });
exports.__test = {
  createHandler,
  reserveDailyUsage,
  shanghaiDateKey,
  anonymizeUserId,
  CRISIS_REPLY,
  SAFE_FALLBACK_REPLY,
  SYSTEM_PROMPT,
  CRISIS_PATTERN,
  UNSAFE_REPLY_PATTERNS
};
