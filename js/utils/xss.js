// =============================================================
// XSS 安全工具
// =============================================================

/**
 * 将用户输入安全地转义为 HTML 文本节点。
 * 仅用于将文本插入 HTML 文本节点位置（如 <p>${text}</p> 中的 text）。
 * 禁止用于：onclick/href/src/style/data 属性/HTML 标签名/CSS/JS 字符串。
 * 优先使用 createElement + textContent 代替此函数。
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
