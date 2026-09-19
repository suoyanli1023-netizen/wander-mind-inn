const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer'
};

function jsonResponse(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders }
  });
}

export default {
  fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: JSON_HEADERS });
    }

    if (request.method !== 'GET') {
      return jsonResponse(
        { ok: false, error: 'method_not_allowed' },
        405,
        { Allow: 'GET, OPTIONS' }
      );
    }

    return jsonResponse({
      ok: true,
      service: 'wander-mind-ai-gateway',
      version: 'health-v1',
      timestamp: new Date().toISOString()
    }, 200);
  }
};
