// =============================================================
// AI 陪伴：CloudBase 匿名会话 + AI Gateway
// =============================================================

const AI_CLOUDBASE_ENV_ID = 'cloudbase-d4gvblu5z203a2fd7';
const AI_AUTH_URL = 'https://' + AI_CLOUDBASE_ENV_ID + '.api.tcloudbasegateway.com/auth/v1/signin/anonymously';
const AI_GATEWAY_ORIGIN = 'https://cloudbase-d4gvblu5z203a2fd7-1460873990.ap-shanghai.app.tcloudbase.com';
const AI_CHAT_URL = AI_GATEWAY_ORIGIN + '/api/chat';
const AI_DEVICE_ID_KEY = 'cloudbase_anonymous_device_id';
const AI_MAX_MESSAGE_LENGTH = 2000;
const AI_AUTH_TIMEOUT_MS = 10000;
const AI_CLIENT_TIMEOUT_MS = 16000;

let _aiAccessToken = '';
let _aiAccessTokenExpiresAt = 0;
let _aiAccessTokenPromise = null;
let _aiRequestPending = false;
let _aiLastFocusedElement = null;

function createAiDeviceId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID().replace(/-/g, '');
  }
  const randomPart = Math.random().toString(36).slice(2);
  return 'web' + Date.now().toString(36) + randomPart;
}

function getAiDeviceId() {
  let deviceId = localStorage.getItem(AI_DEVICE_ID_KEY);
  if (!deviceId || !/^[A-Za-z0-9_-]{16,128}$/.test(deviceId)) {
    deviceId = createAiDeviceId();
    localStorage.setItem(AI_DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

async function ensureAiAccessToken(forceRefresh) {
  if (!forceRefresh && _aiAccessToken && Date.now() < _aiAccessTokenExpiresAt - 60000) {
    return _aiAccessToken;
  }
  if (!forceRefresh && _aiAccessTokenPromise) return _aiAccessTokenPromise;

  _aiAccessToken = '';
  _aiAccessTokenExpiresAt = 0;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_AUTH_TIMEOUT_MS);
  const loginPromise = (async function() {
    const response = await fetch(AI_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-device-id': getAiDeviceId()
      },
      body: '{}',
      cache: 'no-store',
      signal: controller.signal
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok || !data || typeof data.access_token !== 'string' || !data.access_token) {
      throw new Error('anonymous_login_failed');
    }

    const expiresIn = Number(data.expires_in);
    _aiAccessToken = data.access_token;
    _aiAccessTokenExpiresAt = Date.now() + (Number.isFinite(expiresIn) ? expiresIn : 7200) * 1000;
    return _aiAccessToken;
  })();
  _aiAccessTokenPromise = loginPromise;

  try {
    return await loginPromise;
  } finally {
    clearTimeout(timeout);
    if (_aiAccessTokenPromise === loginPromise) _aiAccessTokenPromise = null;
  }
}

async function prewarmAiSession() {
  if (localStorage.getItem(PUBLIC_EXPERIENCE_CONSENT_KEY) !== 'accepted') return;
  try {
    await ensureAiAccessToken(false);
  } catch {
    // AI 不可用不能阻断五个本地模块，也不在控制台输出令牌或上游详情。
  }
}

function setAiStatus(message, kind) {
  const status = document.getElementById('ai-status');
  if (!status) return;
  status.textContent = message || '';
  status.className = 'ai-status' + (kind ? ' ' + kind : '');
}

function appendAiMessage(role, message) {
  const list = document.getElementById('ai-messages');
  if (!list) return;
  const item = document.createElement('div');
  item.className = 'ai-message ai-message-' + role;
  item.textContent = message;
  list.appendChild(item);
  list.scrollTop = list.scrollHeight;
}

function openAiCompanion() {
  const dialog = document.getElementById('ai-dialog');
  const overlay = document.getElementById('ai-overlay');
  if (!dialog || !overlay) return;
  _aiLastFocusedElement = document.activeElement;
  dialog.classList.add('show');
  overlay.classList.add('show');
  document.body.classList.add('ai-dialog-open');
  const input = document.getElementById('ai-message-input');
  if (input) setTimeout(() => input.focus(), 80);
  prewarmAiSession();
}

function closeAiCompanion() {
  const dialog = document.getElementById('ai-dialog');
  const overlay = document.getElementById('ai-overlay');
  if (!dialog || !overlay) return;
  dialog.classList.remove('show');
  overlay.classList.remove('show');
  document.body.classList.remove('ai-dialog-open');
  if (_aiLastFocusedElement && typeof _aiLastFocusedElement.focus === 'function') {
    _aiLastFocusedElement.focus();
  }
}

async function requestAiReply(message, retryAfterAuth) {
  const token = await ensureAiAccessToken(false);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_CLIENT_TIMEOUT_MS);
  let response;

  try {
    response = await fetch(AI_CHAT_URL, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json'
      },
      body: JSON.stringify({ message: message }),
      cache: 'no-store',
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 401 && retryAfterAuth) {
    await ensureAiAccessToken(true);
    return requestAiReply(message, false);
  }

  if (!response.ok || !data || data.ok !== true || typeof data.reply !== 'string') {
    const error = new Error('chat_failed');
    error.status = response.status;
    error.code = data && (data.error || data.code);
    throw error;
  }

  return data.reply.trim();
}

function aiFriendlyError(error) {
  if (error && error.name === 'AbortError') {
    return '这次回复等得有些久，请稍后再试。其他情绪模块仍可正常使用。';
  }
  if (error && error.status === 429) {
    return '今天的 AI 陪伴次数已经用完了。你仍可以继续使用小屋、绘画和其他本地模块。';
  }
  if (error && (error.status === 502 || error.status === 503)) {
    return 'AI 陪伴正在短暂休息，请稍后再试。其他情绪模块仍可正常使用。';
  }
  return '暂时没能连接到 AI 陪伴，请检查网络后再试。其他情绪模块仍可正常使用。';
}

async function sendAiMessage() {
  if (_aiRequestPending) return;
  const input = document.getElementById('ai-message-input');
  const sendButton = document.getElementById('ai-send-button');
  if (!input || !sendButton) return;
  const message = input.value.trim();
  if (!message) {
    setAiStatus('写下一点想说的话再发送吧。', 'error');
    input.focus();
    return;
  }
  if (message.length > AI_MAX_MESSAGE_LENGTH) {
    setAiStatus('内容最多可以输入 2000 个字符。', 'error');
    return;
  }

  _aiRequestPending = true;
  sendButton.disabled = true;
  input.disabled = true;
  appendAiMessage('user', message);
  input.value = '';
  updateAiCharacterCount();
  setAiStatus('小栈正在认真读你的话……', 'loading');

  try {
    const reply = await requestAiReply(message, true);
    appendAiMessage('assistant', reply || '我在这里。我们可以慢慢来。');
    setAiStatus('', '');
  } catch (error) {
    setAiStatus(aiFriendlyError(error), 'error');
  } finally {
    _aiRequestPending = false;
    sendButton.disabled = false;
    input.disabled = false;
    input.focus();
  }
}

function updateAiCharacterCount() {
  const input = document.getElementById('ai-message-input');
  const count = document.getElementById('ai-char-count');
  if (input && count) count.textContent = input.value.length + ' / ' + AI_MAX_MESSAGE_LENGTH;
}

function initAiCompanion() {
  // 清理旧版曾保存在浏览器中的模型配置，公开版不再从前端读取密钥。
  localStorage.removeItem('api_key');
  localStorage.removeItem('api_url');

  const input = document.getElementById('ai-message-input');
  const list = document.getElementById('ai-messages');
  if (!input || !list) return;
  if (!list.childElementCount) {
    appendAiMessage('assistant', '我在这里。你可以写下一点此刻的感受，我们慢慢说。');
  }
  input.addEventListener('input', updateAiCharacterCount);
  input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendAiMessage();
    }
  });
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && document.getElementById('ai-dialog').classList.contains('show')) {
      closeAiCompanion();
    }
  });
  updateAiCharacterCount();
  if (document.getElementById('page-home').classList.contains('active')) prewarmAiSession();
}
