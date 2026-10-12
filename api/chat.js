import { createHash, timingSafeEqual } from 'node:crypto';

const ARK_CHAT_COMPLETIONS_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const MAX_MESSAGE_LENGTH = 2000;
const MAX_OUTPUT_TOKENS = 220;
const REQUEST_TIMEOUT_MS = 12000;

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

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer'
};

function jsonResponse(body, status, requestId, extraHeaders = {}) {
  return new Response(JSON.stringify({ ...body, requestId }), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders }
  });
}

function errorResponse(error, status, requestId, extraHeaders) {
  return jsonResponse({ ok: false, error }, status, requestId, extraHeaders);
}

function safeTokenEqual(providedToken, expectedToken) {
  const providedHash = createHash('sha256').update(providedToken, 'utf8').digest();
  const expectedHash = createHash('sha256').update(expectedToken, 'utf8').digest();
  return timingSafeEqual(providedHash, expectedHash);
}

function extractReply(data) {
  const content = data?.choices?.[0]?.message?.content;
  return typeof content === 'string' ? content.trim() : '';
}

function isUnsafeReply(reply) {
  return UNSAFE_REPLY_PATTERNS.some(pattern => pattern.test(reply));
}

export default {
  async fetch(request) {
    const requestId = crypto.randomUUID();

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: JSON_HEADERS });
    }

    if (request.method !== 'POST') {
      return errorResponse('method_not_allowed', 405, requestId, {
        Allow: 'POST, OPTIONS'
      });
    }

    const apiKey = process.env.ARK_API_KEY;
    const model = process.env.ARK_MODEL_ID;
    const testToken = process.env.AI_GATEWAY_TEST_TOKEN;
    if (!apiKey || !model || !testToken) {
      return errorResponse('service_unavailable', 503, requestId);
    }

    const authorization = request.headers.get('Authorization') || '';
    const providedToken = authorization.startsWith('Bearer ')
      ? authorization.slice('Bearer '.length)
      : '';
    if (!providedToken || !safeTokenEqual(providedToken, testToken)) {
      return errorResponse('unauthorized', 401, requestId);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse('invalid_json', 400, requestId);
    }

    if (!body || typeof body.message !== 'string' || !body.message.trim()) {
      return errorResponse('invalid_message', 400, requestId);
    }

    const message = body.message.trim();
    if (message.length > MAX_MESSAGE_LENGTH) {
      return errorResponse('message_too_long', 400, requestId);
    }

    if (CRISIS_PATTERN.test(message)) {
      return jsonResponse({ ok: true, reply: CRISIS_REPLY }, 200, requestId);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const upstream = await fetch(ARK_CHAT_COMPLETIONS_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
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
        return errorResponse('upstream_unavailable', 502, requestId);
      }

      let data;
      try {
        data = await upstream.json();
      } catch {
        return errorResponse('upstream_unavailable', 502, requestId);
      }

      const reply = extractReply(data);
      if (!reply) {
        return errorResponse('upstream_unavailable', 502, requestId);
      }

      return jsonResponse({
        ok: true,
        reply: isUnsafeReply(reply) ? SAFE_FALLBACK_REPLY : reply
      }, 200, requestId);
    } catch {
      return errorResponse('upstream_unavailable', 502, requestId);
    } finally {
      clearTimeout(timeout);
    }
  }
};
