// =============================================================
// 页面导航
// =============================================================
function navigateTo(pageId) {
  SoundFX.pageTransition();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  STATE.currentPage = pageId;
  saveToStorage();
  if (pageId === 'page-atmosphere') {
    initAtmosphere();
  }
  if (pageId === 'page-choice') {
    initChoicePage();
  }
}

function exitModule(pageId) {
  // 先保存当前进度
  saveToStorage();
  // 检测是否有情绪标签
  const tags = detectMoodTags();
  if (tags.length > 0) {
    showExitModal(tags);
  } else {
    navigateTo('page-home');
  }
}

// =============================================================
// 退出弹窗
// =============================================================
let exitCallback = null;

function showExitModal(tags) {
  const container = document.getElementById('exit-mood-tags');
  // 安全清空
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  // 使用 createElement + textContent 构建
  tags.forEach(t => {
    const span = document.createElement('span');
    span.className = 'exit-mood-tag';
    span.textContent = t;
    container.appendChild(span);
  });
  document.getElementById('exit-overlay').classList.add('show');
}

function closeExitModal() {
  document.getElementById('exit-overlay').classList.remove('show');
}

function confirmExit() {
  closeExitModal();
  saveToStorage();
  navigateTo('page-home');
}
