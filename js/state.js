// =============================================================
// 全局状态
// =============================================================
const STATE = window.STATE = {
  archives: [],       // 情绪旅程存档
  currentJourneyId: null,
  houseState: { base: null, bg: null, mood: null, decos: [], diy: { skin: 'light', outfit: 'casual', acces: 'hat' } },
  atmosphereState: { bg: null, base: null, furniture: [], characters: [], done: false },
  drawState: { imageIdx: 0, q1: '', q2: '', q3: '', done: false },
  worryState: { fragments: [] },
  choiceState: { idx: 0, answers: [], saved: false, questions: [] },
  currentPage: 'page-home',
  originalTitle: ''
};
