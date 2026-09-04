// =============================================================
// 登录系统：OAuth 跳转 + localStorage 缓存 + 自动跳转主页
// =============================================================

// OAuth 回调地址（部署后替换为实际域名）
const OAUTH_CALLBACK_URL = 'https://cloudbase-d4gvblu5z203a2fd7.tcloudbaseapp.com/callback';

// 微信小程序 AppID（替换为实际小程序 AppID）
const WECHAT_MINIPROGRAM_APPID = 'YOUR_MINIPROGRAM_APPID';

// GitHub OAuth App Client ID
const GITHUB_CLIENT_ID = 'Ov23li0bhQP8YSQk41x4';

// Google OAuth Client ID
const GOOGLE_CLIENT_ID = '1068484025478-63u3eur7k33llrqrv33len1657p6vcl0.apps.googleusercontent.com';

// ---- 登录成功统一处理 ----
function handleLoginSuccess(provider, userId, nickname) {
  localStorage.setItem('login_user_id', userId);
  localStorage.setItem('login_nickname', nickname);
  localStorage.setItem('login_provider', provider);
  localStorage.setItem('login_time', Date.now());
  // 跳转主页
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-home').classList.add('active');
  STATE.currentPage = 'page-home';
  SoundFX.pageTransition();
}

// ---- 检查是否已登录 ----
function checkLoginStatus() {
  const userId = localStorage.getItem('login_user_id');
  const nickname = localStorage.getItem('login_nickname');
  if (userId && nickname) {
    // 已登录，直接跳主页
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-home').classList.add('active');
    STATE.currentPage = 'page-home';
    return true;
  }
  return false;
}

// ---- 退出登录 ----
function logout() {
  localStorage.removeItem('login_user_id');
  localStorage.removeItem('login_nickname');
  localStorage.removeItem('login_provider');
  localStorage.removeItem('login_time');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-login').classList.add('active');
  STATE.currentPage = 'page-login';
}

// ---- OAuth 回调处理（URL 中带 code 参数时执行）----
// 演示模式：不进行服务端 token 交换，不自动登录成功
// 正式 OAuth 留到服务端认证阶段实现
function handleOAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  if (!code) return false;

  // state 白名单校验：仅允许 github 或 google
  const ALLOWED_STATES = ['github', 'google'];
  if (!state || !ALLOWED_STATES.includes(state)) {
    // 非法 state，清除 URL 参数后返回
    window.history.replaceState({}, document.title, window.location.pathname);
    return false;
  }

  // code 类型与最大长度限制（不限制字符集，因为合法 OAuth code 可能包含多种字符）
  // 仅限制为字符串类型且最大 512 字符
  if (typeof code !== 'string' || code.length > 512) {
    window.history.replaceState({}, document.title, window.location.pathname);
    return false;
  }

  // 演示模式：不把 code 写入用户资料，不自动登录
  // 仅在控制台提示，并清除 URL 参数
  console.log('[演示模式] 收到 ' + state + ' OAuth 回调，code 长度: ' + code.length + '。服务端认证尚未接入，不会自动登录。');
  window.history.replaceState({}, document.title, window.location.pathname);

  // 在登录页显示提示信息
  const loginPage = document.getElementById('page-login');
  if (loginPage) {
    const notice = document.createElement('div');
    notice.style.cssText = 'margin-top:12px;padding:10px 16px;background:#fff3cd;border-radius:8px;font-size:13px;color:#856404;text-align:center;';
    notice.textContent = '已收到 ' + state + ' 授权回调，但正式认证服务尚未接入。请使用「调试：模拟登录」进入。';
    const container = loginPage.querySelector('.login-container');
    if (container) container.appendChild(notice);
  }

  return false;
}

// ---- 邮箱验证码模拟发送 ----
let _emailCodeTimer = null;
function sendEmailCode() {
  const emailUser = document.getElementById('emailUser').value.trim();
  if (!emailUser) {
    alert('请先输入邮箱账号');
    return;
  }
  const domain = document.getElementById('emailDomain').value;
  const email = emailUser + domain;
  // 生成 6 位随机验证码（实际项目中由后端发送邮件）
  const code = String(Math.floor(100000 + Math.random() * 900000));
  localStorage.setItem('email_code', code);
  localStorage.setItem('email_address', email);
  alert('验证码已发送至 ' + email + '\n（演示模式，验证码为：' + code + '）');

  // 倒计时
  const btn = document.getElementById('sendCodeBtn');
  let countdown = 60;
  btn.disabled = true;
  btn.textContent = countdown + 's';
  if (_emailCodeTimer) clearInterval(_emailCodeTimer);
  _emailCodeTimer = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      clearInterval(_emailCodeTimer);
      btn.disabled = false;
      btn.textContent = '获取验证码';
    } else {
      btn.textContent = countdown + 's';
    }
  }, 1000);
}

// ---- 邮箱验证码登录 ----
function emailLogin() {
  const emailUser = document.getElementById('emailUser').value.trim();
  const code = document.getElementById('emailCode').value.trim();
  const savedCode = localStorage.getItem('email_code');
  if (!emailUser) { alert('请输入邮箱账号'); return; }
  if (!code) { alert('请输入验证码'); return; }
  if (code !== savedCode) { alert('验证码不正确'); return; }
  const domain = document.getElementById('emailDomain').value;
  const email = emailUser + domain;
  handleLoginSuccess('email', 'email_' + btoa(email).replace(/=/g, ''), emailUser);
  localStorage.removeItem('email_code');
  localStorage.removeItem('email_address');
}

// ---- 微信小程序登录：通过 postMessage 唤起小程序登录流程 ----
function triggerWxLogin() {
  SoundFX.click();
  window.postMessage({ type: 'getWxLogin' });
}

// ---- 监听小程序传回的登录成功数据 ----
window.addEventListener('message', function(e) {
  var res = e.data;
  if (res && res.type === 'wxLoginSuccess' && res.openid) {
    localStorage.setItem('user_openid', res.openid);
    // 缓存用户标识与昵称，走统一登录成功流程
    var nickname = res.nickname || '微信用户';
    handleLoginSuccess('wechat', 'wx_' + res.openid, nickname);
    alert('情绪小屋登录完毕，可以开始搭建小屋');
  }
});

// ---- 初始化登录按钮事件 ----
function initLoginPage() {
  const wechatBtn = document.getElementById('wechatLogin');
  const githubBtn = document.getElementById('githubLogin');
  const googleBtn = document.getElementById('googleLogin');
  const sendCodeBtn = document.getElementById('sendCodeBtn');
  const emailLoginBtn = document.getElementById('emailLoginBtn');
  const debugBtn = document.getElementById('debugLoginBtn');

  if (wechatBtn) wechatBtn.onclick = triggerWxLogin;

  if (githubBtn) githubBtn.onclick = function() {
    SoundFX.click();
    // GitHub OAuth 授权
    const redirectUrl = OAUTH_CALLBACK_URL;
    window.location.href = 'https://github.com/login/oauth/authorize?client_id=' + GITHUB_CLIENT_ID
      + '&redirect_uri=' + encodeURIComponent(redirectUrl)
      + '&scope=user:email'
      + '&state=github';
  };

  if (googleBtn) googleBtn.onclick = function() {
    SoundFX.click();
    // Google OAuth 2.0 授权
    const redirectUrl = OAUTH_CALLBACK_URL;
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + GOOGLE_CLIENT_ID
      + '&redirect_uri=' + encodeURIComponent(redirectUrl)
      + '&response_type=code'
      + '&scope=openid%20email%20profile'
      + '&state=google';
  };

  if (sendCodeBtn) sendCodeBtn.onclick = function() {
    SoundFX.click();
    sendEmailCode();
  };

  if (emailLoginBtn) emailLoginBtn.onclick = function() {
    SoundFX.click();
    emailLogin();
  };

  if (debugBtn) debugBtn.onclick = function() {
    SoundFX.click();
    // 调试模式：模拟登录直接进入
    handleLoginSuccess('debug', 'debug_user_' + Date.now(), '体验用户');
  };
}
