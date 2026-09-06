// =============================================================
// 存档管理
// =============================================================
let _renderArchiveLock = false;
function renderArchive() {
  if (_renderArchiveLock) return;
  _renderArchiveLock = true;

  try {
    const list = document.getElementById('archive-list');
    const empty = document.getElementById('archive-empty');
    if (!list || !empty) return;

    // 安全清空：逐个移除子元素，避免 innerHTML = '' 触发 React 重渲染循环
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    if (STATE.archives.length === 0) {
      list.style.display = 'none';
      empty.style.display = 'block';
      return;
    }

    list.style.display = 'flex';
    empty.style.display = 'none';

    // 按时间倒序
    const sorted = [...STATE.archives].reverse();
    sorted.forEach((arc, idx) => {
      const realIdx = STATE.archives.length - 1 - idx;

      const div = document.createElement('div');
      div.className = 'archive-item';

      // 顶部区域
      const top = document.createElement('div');
      top.className = 'archive-item-top';

      const info = document.createElement('div');
      info.className = 'archive-item-info';

      const nameDiv = document.createElement('div');
      nameDiv.className = 'archive-item-name';
      nameDiv.textContent = '📓 ' + (arc.name || '未命名旅程');
      nameDiv.addEventListener('click', () => renameJourney(realIdx));
      info.appendChild(nameDiv);

      const dateDiv = document.createElement('div');
      dateDiv.className = 'archive-item-date';
      dateDiv.textContent = (arc.date || '') + ' · ' + (arc.stickers ? arc.stickers.length : 0) + ' 张贴纸';
      info.appendChild(dateDiv);

      top.appendChild(info);

      const actions = document.createElement('div');
      actions.className = 'archive-item-actions';

      const renameBtn = document.createElement('button');
      renameBtn.className = 'btn-icon-sm';
      renameBtn.title = '重命名';
      renameBtn.textContent = '✏️';
      renameBtn.addEventListener('click', () => renameJourney(realIdx));
      actions.appendChild(renameBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-icon-sm';
      deleteBtn.title = '删除';
      deleteBtn.textContent = '🗑️';
      deleteBtn.addEventListener('click', () => deleteJourney(realIdx));
      actions.appendChild(deleteBtn);

      top.appendChild(actions);
      div.appendChild(top);

      // 贴纸行
      const stickersRow = document.createElement('div');
      stickersRow.className = 'stickers-row';

      (arc.stickers || []).forEach((s, si) => {
        const thumb = document.createElement('div');
        thumb.className = 'sticker-thumb';
        thumb.textContent = s.emoji || '🌸';

        const del = document.createElement('span');
        del.className = 'sticker-del';
        del.textContent = '✕';
        del.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteSticker(realIdx, si);
        });
        thumb.appendChild(del);
        stickersRow.appendChild(thumb);
      });

      div.appendChild(stickersRow);
      list.appendChild(div);
    });
  } finally {
    _renderArchiveLock = false;
  }
}

function newJourney() {
  if (STATE.archives.length > 0) {
    if (!confirm('开启全新旅程后，当前的旅程存档会保留。确定要新建吗？')) return;
  }
  const name = prompt('给这次旅程起个名字吧 💫', `心灵漫游 ${STATE.archives.length + 1}`);
  if (!name) return;
  const safeName = truncateUnicode(name, 30);
  STATE.archives.push({
    id: Date.now().toString(),
    name: safeName,
    date: new Date().toLocaleDateString('zh-CN'),
    stickers: []
  });
  STATE.currentJourneyId = STATE.archives[STATE.archives.length - 1].id;
  saveToStorage();
  renderArchive();
}

function renameJourney(idx) {
  const arc = STATE.archives[idx];
  if (!arc) return;
  const newName = prompt('给这段旅程一个新名字吧 📓', arc.name);
  if (newName) {
    arc.name = truncateUnicode(newName, 30);
    saveToStorage();
    renderArchive();
  }
}

function deleteJourney(idx) {
  if (!confirm('确定要删除这段旅程存档吗？所有贴纸都将被移除 🗑️')) return;
  STATE.archives.splice(idx, 1);
  saveToStorage();
  renderArchive();
}

function deleteSticker(idx, si) {
  const arc = STATE.archives[idx];
  if (!arc || !arc.stickers) return;
  arc.stickers.splice(si, 1);
  saveToStorage();
  renderArchive();
}

function addStickerToArchive(emoji, label, mood) {
  // 找到当前旅程或创建新旅程
  let arc = STATE.archives.find(a => a.id === STATE.currentJourneyId);
  if (!arc) {
    const name = `心灵漫游 ${STATE.archives.length + 1}`;
    arc = {
      id: Date.now().toString(),
      name: name,
      date: new Date().toLocaleDateString('zh-CN'),
      stickers: []
    };
    STATE.archives.push(arc);
    STATE.currentJourneyId = arc.id;
  }
  arc.stickers.push({ emoji, label, mood, date: new Date().toLocaleString('zh-CN') });
  SoundFX.sticker();
  saveToStorage();
  renderArchive();
}

function addStickerAndBack(emoji, label, mood) {
  addStickerToArchive(emoji, label, mood);
  navigateTo('page-home');
}
