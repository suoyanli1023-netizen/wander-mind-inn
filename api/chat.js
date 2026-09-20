import { createHash, timingSafeEqual } from 'node:crypto';

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const MODEL = 'gpt-4.1-mini';
const MAX_MESSAGE_LENGTH = 2000;
const MAX_OUTPUT_TOKENS = 220;
const REQUEST_TIMEOUT_MS = 12000;

const SYSTEM_PROMPT = `你是“心绪漫游小栈”的温和陪伴助手。回复要温和、简短、具体，不说教。
不要虚构用户信息；信息不足时要明确说明，并可提出一个简短的澄清问题。
不要进行心理或医学诊断，不要把回复描述为专业诊疗，也不要声称能够替代专业帮助。
如果用户提到自伤、自杀、正在发生的暴力或其他紧急危险，优先建议立即联系当地紧急服务，并联系身边可信任的人获得现实支持。`;

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
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  if (!Array.isArray(data?.output)) return '';
  return data.output
    .flatMap(item => Array.isArray(item?.content) ? item.content : [])
    .filter(item => item?.type === 'output_text' && typeof item.text === 'string')
    .map(item => item.text)
    .join('')
    .trim();
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

    const apiKey = process.env.OPENAI_API_KEY;
    const testToken = process.env.AI_GATEWAY_TEST_TOKEN;
    if (!apiKey || !testToken) {
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

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const upstream = await fetch(OPENAI_RESPONSES_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: MODEL,
          instructions: SYSTEM_PROMPT,
          input: message,
          max_output_tokens: MAX_OUTPUT_TOKENS,
          store: false
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

      return jsonResponse({ ok: true, reply }, 200, requestId);
    } catch {
      return errorResponse('upstream_unavailable', 502, requestId);
    } finally {
      clearTimeout(timeout);
    }
  }
};
