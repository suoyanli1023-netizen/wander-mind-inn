/**
 * Unicode 安全截断：按码点（而非 UTF-16 单元）截取字符串。
 * 避免 emoji 等多字节字符被从中间切断。
 */
function truncateUnicode(str, maxLen) {
  if (typeof str !== 'string') return '';
  return Array.from(str.trim()).slice(0, maxLen).join('');
}
