// =============================================================
// 音效系统（Web Audio API 程序化生成，无需外部文件）
// =============================================================
// 音效系统（静态 wav 文件播放，兼容移动端）
// =============================================================
const SoundFX = window.SoundFX = {
  enabled: true,
  mood: null,
  toneOffset: 2,
  moodIntensity: 0,

  init() {
    const saved = localStorage.getItem('sound_enabled');
    if (saved !== null) this.enabled = saved === 'true';
  },

  resume() { /* 静态音频无需 resume */ },

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('sound_enabled', this.enabled);
    return this.enabled;
  },

  // 设置情绪基调（保留接口兼容，静态音频不动态变调）
  setMood(mood) { this.mood = mood; },
  adjustMood(weight) { this.moodIntensity = Math.max(-4, Math.min(4, this.moodIntensity + weight)); },
  resetMoodIntensity() { this.moodIntensity = 0; },

  // 核心：播放指定音效
  play(name) {
    if (!this.enabled) return;
    const el = document.getElementById('sfx-' + name);
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
  },

  // --- 各场景音效 ---
  click()         { this.play('click'); },
  pageTransition(){ this.play('pageTransition'); },
  place()         { this.play('place'); },
  select()        { this.play('select'); },
  mascot()        { this.play('mascot'); },
  complete()      { this.play('complete'); },
  sticker()       { this.play('sticker'); },
  shredder()      { this.play('shredder'); },
  waterFlow()     { this.play('waterFlow'); },
  drawStart()     { this.play('drawStart'); },
  choice()        { this.play('choice'); },
  toggleSound()   { this.play('toggleSound'); },
  animBg()        { this.play('animBg'); },
  animBase()      { this.play('animBase'); },

  // 向后兼容别名
  shatter() { this.shredder(); },
  splash() { this.waterFlow(); }
};

// 更新音效开关UI
function updateSoundToggleUI() {
  const toggle = document.getElementById('sound-toggle');
  const track = document.getElementById('sound-switch-track');
  const thumb = document.getElementById('sound-switch-thumb');
  const label = document.getElementById('sound-label');
  if (!toggle) return;
  const enabled = SoundFX.enabled;
  toggle.checked = enabled;
  if (enabled) {
    track.style.background = '#e8b4b8';
    thumb.style.left = '20px';
    label.textContent = '开启';
  } else {
    track.style.background = '#e0d8d4';
    thumb.style.left = '2px';
    label.textContent = '关闭';
  }
}

// 切换音效设置
function toggleSoundSetting() {
  const enabled = SoundFX.toggle();
  updateSoundToggleUI();
  if (enabled) SoundFX.toggleSound();
}
