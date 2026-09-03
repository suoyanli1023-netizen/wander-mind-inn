// =============================================================
// 本地存储
// =============================================================

let _saveTimer = null;
let _savePending = false;
function saveToStorageDebounced() {
  if (_saveTimer) clearTimeout(_saveTimer);
  _savePending = true;
  _saveTimer = setTimeout(() => {
    _savePending = false;
    saveToStorage();
  }, 500);
}

function saveToStorage() {
  try {
    localStorage.setItem('soul_journey', JSON.stringify({
      archives: STATE.archives,
      houseState: STATE.houseState,
      drawState: STATE.drawState,
      worryState: STATE.worryState,
      choiceState: STATE.choiceState
    }));
  } catch(e) { /* storage full - ignore */ }
}

function loadFromStorage() {
  try {
    const data = JSON.parse(localStorage.getItem('soul_journey'));
    if (data) {
      STATE.archives = data.archives || [];
      STATE.houseState = { ...STATE.houseState, ...(data.houseState || {}) };
      STATE.drawState = { ...STATE.drawState, ...(data.drawState || {}) };
      STATE.worryState = { ...STATE.worryState, ...(data.worryState || {}) };
      STATE.choiceState = { ...STATE.choiceState, ...(data.choiceState || {}) };
    }
  } catch(e) {}
}
