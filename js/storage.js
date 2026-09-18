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
      atmosphereState: STATE.atmosphereState,
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
      if (data.atmosphereState && typeof data.atmosphereState === 'object' && !Array.isArray(data.atmosphereState)) {
        const savedAtmosphere = data.atmosphereState;
        const restoreAtmosItems = items => Array.isArray(items) ? items
          .filter(item => item && typeof item.id === 'string' && typeof item.path === 'string' &&
            Number.isFinite(Number(item.x)) && Number.isFinite(Number(item.y)) && Number.isFinite(Number(item.w)))
          .map(item => ({ id: item.id, path: item.path, x: Number(item.x), y: Number(item.y), w: Number(item.w) })) : [];
        STATE.atmosphereState = {
          ...STATE.atmosphereState,
          bg: typeof savedAtmosphere.bg === 'string' || savedAtmosphere.bg === null ? savedAtmosphere.bg : STATE.atmosphereState.bg,
          base: typeof savedAtmosphere.base === 'string' || savedAtmosphere.base === null ? savedAtmosphere.base : STATE.atmosphereState.base,
          furniture: restoreAtmosItems(savedAtmosphere.furniture),
          characters: restoreAtmosItems(savedAtmosphere.characters),
          done: typeof savedAtmosphere.done === 'boolean' ? savedAtmosphere.done : STATE.atmosphereState.done
        };
      }
      STATE.drawState = { ...STATE.drawState, ...(data.drawState || {}) };
      STATE.worryState = { ...STATE.worryState, ...(data.worryState || {}) };
      STATE.choiceState = { ...STATE.choiceState, ...(data.choiceState || {}) };
    }
  } catch(e) {}
}
