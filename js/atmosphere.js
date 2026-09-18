// =============================================================
// 氛围小屋素材定义
// =============================================================
const ATMOSPHERE_ASSETS = {
  backgrounds: [
    'assets/backgrounds/温馨小屋图片（简单元素） (6).png',
    'assets/backgrounds/温馨小屋图片（简单元素） (7).png',
    'assets/backgrounds/温馨小屋图片（简单元素） (8).png',
    'assets/backgrounds/温馨小屋图片（简单元素） (9).png',
    'assets/backgrounds/温馨小屋图片（简单元素） (10).png',
    'assets/backgrounds/温馨小屋图片（简单元素） (11).png',
    'assets/backgrounds/温馨小屋图片（简单元素） (12).png',
    'assets/backgrounds/温馨小屋图片（简单元素） (13).png',
  ],
  'cabin-basics': [
    'assets/cabin-basics/温馨小屋图片（简单元素）.png',
    'assets/cabin-basics/温馨小屋图片（简单元素） (1).png',
    'assets/cabin-basics/温馨小屋图片（简单元素） (2).png',
    'assets/cabin-basics/温馨小屋图片（简单元素） (3).png',
    'assets/cabin-basics/温馨小屋图片（简单元素） (4).png',
    'assets/cabin-basics/温馨小屋图片（简单元素） (5).png',
  ],
  furniture: [
    'assets/furniture/温馨小屋图片（简单元素） (6).png',
    'assets/furniture/温馨小屋图片（简单元素） (7).png',
    'assets/furniture/温馨小屋图片（简单元素） (8).png',
    'assets/furniture/温馨小屋图片（简单元素） (9).png',
    'assets/furniture/温馨小屋图片（简单元素） (10).png',
    'assets/furniture/温馨小屋图片（简单元素） (11).png',
    'assets/furniture/温馨小屋图片（简单元素） (12).png',
    'assets/furniture/温馨小屋图片（简单元素） (13).png',
    'assets/furniture/温馨小屋图片（简单元素） (14).png',
    'assets/furniture/温馨小屋图片（简单元素） (15).png',
    'assets/furniture/温馨小屋图片（简单元素） (16).png',
    'assets/furniture/温馨小屋图片（简单元素） (17).png',
    'assets/furniture/温馨小屋图片（简单元素） (18).png',
  ],
  'desk-items': [
    'assets/desk-items/温馨小屋图片（简单元素）.png',
    'assets/desk-items/温馨小屋图片（简单元素） (1).png',
    'assets/desk-items/温馨小屋图片（简单元素） (2).png',
    'assets/desk-items/温馨小屋图片（简单元素） (3).png',
    'assets/desk-items/温馨小屋图片（简单元素） (4).png',
  ],
  character: [
    'assets/character/温馨小屋图片（简单元素）.png',
    'assets/character/温馨小屋图片（简单元素） (1).png',
    'assets/character/温馨小屋图片（简单元素） (2).png',
    'assets/character/温馨小屋图片（简单元素） (3).png',
  ],
};
const ATMOS_TAB_NAMES = {
  backgrounds: '背景',
  'cabin-basics': '小屋基底',
  furniture: '家具',
  'desk-items': '摆件',
  character: '人物',
};
let atmosCurrentTab = 'backgrounds';
let atmosDragItem = null;
let atmosDragOffset = { x: 0, y: 0 };
let atmosCanvasScale = 1;      // 小屋画布当前缩放比例（0.5 ~ 2）
let atmosPinching = false;     // 是否正在双指缩放画布


// =============================================================
// 模块1b: 氛围小屋
// =============================================================
function switchAtmosTab(cat) {
  SoundFX.click();
  atmosCurrentTab = cat;
  document.querySelectorAll('#atmos-tabs .atmosphere-tab').forEach(el => {
    el.classList.toggle('active', el.dataset.cat === cat);
  });
  renderAtmosAssets(cat);
}

function renderAtmosAssets(cat) {
  const container = document.getElementById('atmos-assets');
  const assets = ATMOSPHERE_ASSETS[cat] || [];
  const isSelectType = cat === 'backgrounds' || cat === 'cabin-basics';
  container.innerHTML = assets.map((path, idx) => {
    const encodedPath = encodeURI(path);
    const label = isSelectType ? (cat === 'backgrounds' ? '背景' : '基底') + (idx + 1) : (ATMOS_TAB_NAMES[cat] || '素材') + (idx + 1);
    let action;
    if (isSelectType) {
      action = cat === 'backgrounds' ? `selectAtmosBg('${encodedPath}')` : `selectAtmosBase('${encodedPath}')`;
    } else if (cat === 'character') {
      action = `addAtmosCharacter('${encodedPath}')`;
    } else {
      action = `addAtmosFurniture('${encodedPath}')`;
    }
    return `<div class="atmosphere-asset-item" onclick="${action}" title="${label}">
      <img src="${encodedPath}" alt="${label}" loading="lazy" draggable="false">
    </div>`;
  }).join('');
}

function selectAtmosBg(path, restoring = false) {
  SoundFX.select();
  STATE.atmosphereState.bg = path;
  if (!restoring) STATE.atmosphereState.done = false;
  const layer = document.getElementById('atmos-layer-bg');
  layer.innerHTML = `<img src="${path}" alt="背景" style="width:100%;height:100%;object-fit:cover;">`;
  document.getElementById('atmosphere-canvas').classList.add('has-bg');
  updateAtmosPlaceholder();
  updateAtmosSelectedInfo();
  if (!restoring) saveToStorage();
}

function selectAtmosBase(path, restoring = false) {
  SoundFX.select();
  STATE.atmosphereState.base = path;
  if (!restoring) STATE.atmosphereState.done = false;
  const layer = document.getElementById('atmos-layer-base');
  layer.innerHTML = `<img src="${path}" alt="小屋基底" style="width:100%;height:100%;object-fit:cover;">`;
  updateAtmosPlaceholder();
  updateAtmosSelectedInfo();
  if (!restoring) saveToStorage();
}

function addAtmosFurniture(path) {
  SoundFX.place();
  const id = 'furn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  const layer = document.getElementById('atmos-layer-furniture');
  // 真实生活场景默认位置：家具靠墙摆放，底部对齐，模拟真实房间布局
  const furniturePositions = [
    { x: 8, y: 48, w: 110 },   // 左侧靠墙 - 柜子/书架位
    { x: 72, y: 48, w: 110 },  // 右侧靠墙 - 柜子/书架位
    { x: 38, y: 55, w: 100 },  // 中央偏下 - 桌子/沙发位
    { x: 20, y: 42, w: 85 },   // 左中 - 椅子/小柜
    { x: 62, y: 42, w: 85 },   // 右中 - 椅子/小柜
    { x: 45, y: 30, w: 75 },   // 中上偏后 - 装饰柜
    { x: 5, y: 58, w: 95 },    // 左下角 - 地面家具
    { x: 76, y: 58, w: 95 },   // 右下角 - 地面家具
  ];
  const idx = STATE.atmosphereState.furniture.length;
  const pos = furniturePositions[idx % furniturePositions.length];
  const el = createAtmosItem('furniture-item', id, path, pos.x, pos.y, pos.w, '家具');
  layer.appendChild(el);
  STATE.atmosphereState.furniture.push({ id, path, x: pos.x, y: pos.y, w: pos.w });
  STATE.atmosphereState.done = false;
  setupAtmosInteraction(el);
  updateAtmosSelectedInfo();
  processAtmosImage(el.querySelector('img'));
  saveToStorage();
}

function addAtmosCharacter(path) {
  SoundFX.place();
  const id = 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  const layer = document.getElementById('atmos-layer-character');
  // 人物默认位置：站在小屋中央地面，像真人站在房间里
  const charPositions = [
    { x: 40, y: 50, w: 75 },   // 中央偏左 - 主站位
    { x: 52, y: 52, w: 70 },   // 中央偏右 - 次站位
    { x: 28, y: 48, w: 72 },   // 左侧 - 靠家具站立
    { x: 62, y: 49, w: 72 },   // 右侧 - 靠家具站立
  ];
  const idx = STATE.atmosphereState.characters.length;
  const pos = charPositions[idx % charPositions.length];
  const el = createAtmosItem('character-item', id, path, pos.x, pos.y, pos.w, '人物');
  layer.appendChild(el);
  STATE.atmosphereState.characters.push({ id, path, x: pos.x, y: pos.y, w: pos.w });
  STATE.atmosphereState.done = false;
  setupAtmosInteraction(el);
  updateAtmosSelectedInfo();
  processAtmosImage(el.querySelector('img'));
  saveToStorage();
}

// 创建氛围小屋元素（统一构造）
function createAtmosItem(className, id, path, x, y, w, label) {
  const el = document.createElement('div');
  el.className = className;
  el.id = id;
  el.dataset.path = path;
  el.style.left = x + '%';
  el.style.top = y + '%';
  el.style.width = w + 'px';
  el.innerHTML = `<img src="${path}" alt="${label}" draggable="false">
    <div class="remove-btn" onclick="removeAtmosItem('${id}')">×</div>
    <div class="resize-handle handle-tl"></div>
    <div class="resize-handle handle-tr"></div>
    <div class="resize-handle handle-bl"></div>
    <div class="resize-handle handle-br"></div>
    <div class="item-mood-tip"></div>
    <div class="item-hint">拖动移动 · 四角缩放</div>`;
  return el;
}

// 图片背景去除（智能算法，最大程度减少失真）
function processAtmosImage(imgEl) {
  if (!imgEl || imgEl.dataset.processed) return;
  imgEl.dataset.processed = '1';
  const tryProcess = () => {
    const img = imgEl;
    if (!img.complete || img.naturalWidth === 0) {
      img.addEventListener('load', tryProcess, { once: true });
      return;
    }
    try {
      const canvas = document.createElement('canvas');
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      // 限制处理尺寸，提升性能
      const maxDim = 400;
      const scale = Math.min(1, maxDim / Math.max(w, h));
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const cw = canvas.width;
      const ch = canvas.height;
      const imageData = ctx.getImageData(0, 0, cw, ch);
      const data = imageData.data;

      // 1. 多区域边缘采样：取四条边各若干点，聚类得到背景色
      const edgeSamples = [];
      const step = Math.max(2, Math.floor(Math.min(cw, ch) / 20));
      for (let x = 0; x < cw; x += step) {
        edgeSamples.push([x, 0]);              // 上边
        edgeSamples.push([x, ch - 1]);          // 下边
      }
      for (let y = 0; y < ch; y += step) {
        edgeSamples.push([0, y]);               // 左边
        edgeSamples.push([cw - 1, y]);          // 右边
      }
      // 提取边缘像素RGB
      const edgeColors = edgeSamples.map(([cx, cy]) => {
        const idx = (cy * cw + cx) * 4;
        return [data[idx], data[idx + 1], data[idx + 2]];
      });
      // 按亮度排序，取中间60%的像素做聚类（去除异常值）
      edgeColors.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
      const trimStart = Math.floor(edgeColors.length * 0.2);
      const trimEnd = Math.floor(edgeColors.length * 0.8);
      const trimmed = edgeColors.slice(trimStart, trimEnd);
      // 计算平均背景色
      let bgR = 0, bgG = 0, bgB = 0;
      trimmed.forEach(c => { bgR += c[0]; bgG += c[1]; bgB += c[2]; });
      bgR = Math.round(bgR / trimmed.length);
      bgG = Math.round(bgG / trimmed.length);
      bgB = Math.round(bgB / trimmed.length);

      // 2. 计算边缘像素颜色的标准差，自适应调整容差
      let variance = 0;
      trimmed.forEach(c => {
        const dr = c[0] - bgR, dg = c[1] - bgG, db = c[2] - bgB;
        variance += dr * dr + dg * dg + db * db;
      });
      variance = Math.sqrt(variance / trimmed.length);
      // 容差 = 基础值 + 方差调整，但限制范围
      const tolerance = Math.max(15, Math.min(30, 18 + variance * 0.3));
      const featherRange = 20;
      const tolSq = tolerance * tolerance;
      const featherSq = (tolerance + featherRange) * (tolerance + featherRange);

      // 3. 从外向内的洪水填充式去除：只去除与背景连通的相似区域
      // 先标记边缘像素为"已知背景"
      const visited = new Uint8Array(cw * ch);
      const queue = [];
      for (let x = 0; x < cw; x += 2) {
        queue.push([x, 0]);
        queue.push([x, ch - 1]);
      }
      for (let y = 0; y < ch; y += 2) {
        queue.push([0, y]);
        queue.push([cw - 1, y]);
      }
      while (queue.length > 0) {
        const [px, py] = queue.shift();
        const pi = py * cw + px;
        if (visited[pi]) continue;
        visited[pi] = 1;
        const idx = pi * 4;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        const dr = r - bgR, dg = g - bgG, db = b - bgB;
        const distSq = dr * dr + dg * dg + db * db;
        if (distSq < tolSq * 1.5) {
          // 与背景相似，标记为背景并扩展到邻居
          // 完全透明
          data[idx + 3] = 0;
          // 检查4邻域
          if (px > 0) queue.push([px - 1, py]);
          if (px < cw - 1) queue.push([px + 1, py]);
          if (py > 0) queue.push([px, py - 1]);
          if (py < ch - 1) queue.push([px, py + 1]);
        }
      }

      // 4. 对剩余像素的边缘做羽化：检查alpha>0的像素附近是否有透明像素
      const alphaMap = new Uint8Array(cw * ch);
      for (let i = 0; i < cw * ch; i++) {
        alphaMap[i] = data[i * 4 + 3];
      }
      const featherRadius = 2;
      for (let y = 0; y < ch; y++) {
        for (let x = 0; x < cw; x++) {
          const pi = y * cw + x;
          if (alphaMap[pi] === 0) continue;
          // 检查附近是否有透明像素
          let nearbyTransparent = 0;
          let nearbyCount = 0;
          for (let dy = -featherRadius; dy <= featherRadius; dy++) {
            for (let dx = -featherRadius; dx <= featherRadius; dx++) {
              const nx = x + dx, ny = y + dy;
              if (nx < 0 || nx >= cw || ny < 0 || ny >= ch) continue;
              nearbyCount++;
              if (alphaMap[ny * cw + nx] === 0) nearbyTransparent++;
            }
          }
          if (nearbyTransparent > 0 && nearbyCount > 0) {
            const ratio = nearbyTransparent / nearbyCount;
            const idx = pi * 4;
            const r = data[idx], g = data[idx + 1], b = data[idx + 2];
            const dr = r - bgR, dg = g - bgG, db = b - bgB;
            const distSq = dr * dr + dg * dg + db * db;
            // 如果自身颜色也接近背景，按比例降低不透明度
            if (distSq < featherSq) {
              const t = (distSq - tolSq) / (featherSq - tolSq);
              const keepAlpha = Math.max(t, 1 - ratio * 0.7);
              data[idx + 3] = Math.min(data[idx + 3], Math.round(255 * Math.max(0, keepAlpha)));
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      img.src = canvas.toDataURL('image/png');
    } catch (e) {
      console.warn('Image bg removal skipped:', e);
    }
  };
  tryProcess();
}

function removeAtmosItem(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.remove();
  if (id.startsWith('furn_')) {
    STATE.atmosphereState.furniture = STATE.atmosphereState.furniture.filter(i => i.id !== id);
  } else if (id.startsWith('char_')) {
    STATE.atmosphereState.characters = STATE.atmosphereState.characters.filter(i => i.id !== id);
  }
  STATE.atmosphereState.done = false;
  updateAtmosSelectedInfo();
  saveToStorage();
}

function updateAtmosPlaceholder() {
  const ph = document.getElementById('atmos-placeholder');
  const hasContent = STATE.atmosphereState.bg || STATE.atmosphereState.base;
  ph.style.display = hasContent ? 'none' : 'flex';
}

function updateAtmosSelectedInfo() {
  const info = document.getElementById('atmos-selected-info');
  const { bg, base, furniture, characters } = STATE.atmosphereState;
  const parts = [];
  if (bg) parts.push('背景已选');
  if (base) parts.push('基底已选');
  if (furniture.length) parts.push(`家具${furniture.length}件`);
  if (characters.length) parts.push(`人物${characters.length}个`);
  info.textContent = parts.length ? '当前：' + parts.join(' · ') : '';
}

// 元素交互：选中 + 拖拽移动 + 四角缩放 + 悬浮情绪提示（统一监听，避免冲突）
// 温柔情绪提示文案
const ATMOS_MOOD_TIPS = [
  '这件小物在等你回家',
  '它想陪你度过安静的下午',
  '有它在，角落也不孤单',
  '小小的摆件，大大的陪伴',
  '静静地，它为你守着一盏暖光',
  '此刻的安宁，它也参与了',
  '它把温柔藏在细节里',
];
function setupAtmosInteraction(el) {
  // mode: null | 'drag' | 'resize-tl' | 'resize-tr' | 'resize-bl' | 'resize-br'
  let mode = null;
  let startX = 0, startY = 0, startLeft = 0, startTop = 0, startW = 0;
  const tipEl = el.querySelector('.item-mood-tip');
  const MIN_W = 40, MAX_W = 500;
  // 边界（百分比）：素材限制在画布内部
  const MIN_LEFT = 0, MAX_LEFT = 95;
  const MIN_TOP = 0, MAX_TOP = 90;

  function clientXY(e) {
    if (e.touches && e.touches.length) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }
  function syncState(withW) {
    const id = el.id;
    let arr;
    if (id.startsWith('furn_')) arr = STATE.atmosphereState.furniture;
    else if (id.startsWith('char_')) arr = STATE.atmosphereState.characters;
    if (arr) {
      const item = arr.find(i => i.id === id);
      if (item) {
        item.x = parseFloat(el.style.left);
        item.y = parseFloat(el.style.top);
        if (withW) item.w = parseFloat(el.style.width);
      }
    }
  }

  // 统一按下：选中 + 判断拖拽 / 缩放
  function onPointerDown(e) {
    // 双指缩放画布时，不启动元素交互
    if (atmosPinching) return;
    if (e.touches && e.touches.length > 1) return;
    if (e.target.classList.contains('remove-btn')) return;
    // 选中当前元素，取消其它选中
    document.querySelectorAll('.atmosphere-canvas .selected').forEach(s => {
      if (s !== el) s.classList.remove('selected');
    });
    el.classList.add('selected');

    const handle = e.target.closest('.resize-handle');
    if (handle) {
      e.preventDefault();
      e.stopPropagation();
      if (handle.classList.contains('handle-tl')) mode = 'resize-tl';
      else if (handle.classList.contains('handle-tr')) mode = 'resize-tr';
      else if (handle.classList.contains('handle-bl')) mode = 'resize-bl';
      else mode = 'resize-br';
    } else {
      e.preventDefault();
      e.stopPropagation();
      mode = 'drag';
    }
    const p = clientXY(e);
    startX = p.x; startY = p.y;
    startLeft = parseFloat(el.style.left) || 0;
    startTop = parseFloat(el.style.top) || 0;
    startW = parseFloat(el.style.width) || 100;
    atmosDragItem = el;
    el.style.zIndex = 100;
  }

  function onPointerMove(e) {
    if (!mode || atmosDragItem !== el) return;
    if (atmosPinching) return;
    e.preventDefault();
    const p = clientXY(e);
    const canvas = document.getElementById('atmosphere-canvas');
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dxPx = p.x - startX;
    const dyPx = p.y - startY;
    const dxPct = (dxPx / rect.width) * 100;
    const dyPct = (dyPx / rect.height) * 100;
    // 画布缩放时，像素增量需换算回画布原始坐标
    const scale = atmosCanvasScale || 1;

    if (mode === 'drag') {
      let newLeft = startLeft + dxPct;
      let newTop = startTop + dyPct;
      newLeft = Math.max(MIN_LEFT, Math.min(MAX_LEFT, newLeft));
      newTop = Math.max(MIN_TOP, Math.min(MAX_TOP, newTop));
      el.style.left = newLeft + '%';
      el.style.top = newTop + '%';
    } else {
      // 四角缩放：根据拖拽方向调整宽度与位置
      const dxW = dxPx / scale; // 宽度方向像素增量（换算到画布坐标）
      let newW = startW;
      let newLeft = startLeft;
      let newTop = startTop;
      if (mode === 'resize-br') {
        newW = startW + dxW;
      } else if (mode === 'resize-bl') {
        newW = startW - dxW;
        newLeft = startLeft + dxPct;
      } else if (mode === 'resize-tr') {
        newW = startW + dxW;
        newTop = startTop + dyPct;
      } else if (mode === 'resize-tl') {
        newW = startW - dxW;
        newLeft = startLeft + dxPct;
        newTop = startTop + dyPct;
      }
      // 宽度夹紧；若被夹紧则相应回退 left，避免视觉错位
      const clampedW = Math.max(MIN_W, Math.min(MAX_W, newW));
      if (clampedW !== newW && (mode === 'resize-tl' || mode === 'resize-bl')) {
        newLeft = startLeft + (startW - clampedW) / scale / rect.width * 100;
      }
      newLeft = Math.max(MIN_LEFT, Math.min(MAX_LEFT, newLeft));
      newTop = Math.max(MIN_TOP, Math.min(MAX_TOP, newTop));
      el.style.width = clampedW + 'px';
      el.style.left = newLeft + '%';
      el.style.top = newTop + '%';
    }
  }

  function onPointerUp() {
    if (!mode) return;
    const wasResize = mode && mode.indexOf('resize') === 0;
    const changed = parseFloat(el.style.left) !== startLeft ||
      parseFloat(el.style.top) !== startTop ||
      (wasResize && parseFloat(el.style.width) !== startW);
    mode = null;
    atmosDragItem = null;
    el.style.zIndex = '';
    syncState(wasResize);
    if (changed) {
      STATE.atmosphereState.done = false;
      saveToStorage();
    }
  }

  el.addEventListener('mousedown', onPointerDown);
  el.addEventListener('touchstart', onPointerDown, { passive: false });
  document.addEventListener('mousemove', onPointerMove);
  document.addEventListener('touchmove', onPointerMove, { passive: false });
  document.addEventListener('mouseup', onPointerUp);
  document.addEventListener('touchend', onPointerUp);
  document.addEventListener('touchcancel', onPointerUp);

  // 悬浮温柔情绪提示
  let tipTimer = null;
  el.addEventListener('mouseenter', function() {
    if (!tipEl) return;
    if (tipTimer) clearTimeout(tipTimer);
    tipTimer = setTimeout(() => {
      tipEl.textContent = ATMOS_MOOD_TIPS[Math.floor(Math.random() * ATMOS_MOOD_TIPS.length)];
      tipEl.classList.add('show');
    }, 350);
  });
  el.addEventListener('mouseleave', function() {
    if (tipTimer) { clearTimeout(tipTimer); tipTimer = null; }
    if (tipEl) tipEl.classList.remove('show');
  });
}

// 点击画布空白处取消选中
function initAtmosCanvasDeselect() {
  const canvas = document.getElementById('atmosphere-canvas');
  if (!canvas) return;
  canvas.addEventListener('mousedown', function(e) {
    // 只在点击画布本身或非交互层时取消选中
    if (e.target === canvas || e.target.classList.contains('layer-bg') ||
        e.target.classList.contains('layer-base') || e.target.classList.contains('atmosphere-canvas-placeholder')) {
      canvas.querySelectorAll('.selected').forEach(s => s.classList.remove('selected'));
    }
  });
}

// 画布缩放：鼠标滚轮 + 双指触控（范围 0.5x ~ 2x）
function applyAtmosCanvasScale() {
  const canvas = document.getElementById('atmosphere-canvas');
  if (canvas) canvas.style.transform = 'scale(' + atmosCanvasScale + ')';
}
function initAtmosCanvasZoom() {
  const canvas = document.getElementById('atmosphere-canvas');
  if (!canvas || canvas._atmosZoomInit) return;
  canvas._atmosZoomInit = true;

  // 鼠标滚轮缩放
  canvas.addEventListener('wheel', function(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    atmosCanvasScale = Math.max(0.5, Math.min(2, +(atmosCanvasScale + delta).toFixed(2)));
    applyAtmosCanvasScale();
  }, { passive: false });

  // 双指触控缩放
  let pinchStartDist = 0;
  let pinchStartScale = 1;
  canvas.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      atmosPinching = true;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDist = Math.hypot(dx, dy) || 1;
      pinchStartScale = atmosCanvasScale;
    }
  }, { passive: true });
  canvas.addEventListener('touchmove', function(e) {
    if (e.touches.length === 2 && atmosPinching) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (pinchStartDist > 0) {
        const ratio = dist / pinchStartDist;
        atmosCanvasScale = Math.max(0.5, Math.min(2, +(pinchStartScale * ratio).toFixed(2)));
        applyAtmosCanvasScale();
      }
    }
  }, { passive: false });
  canvas.addEventListener('touchend', function(e) {
    if (e.touches.length < 2) {
      atmosPinching = false;
    }
  }, { passive: true });
  canvas.addEventListener('touchcancel', function() {
    atmosPinching = false;
  }, { passive: true });
}

function completeAtmosphere() {
  const { bg, base, furniture, characters } = STATE.atmosphereState;

  if (!bg && !base && !furniture.length && !characters.length) {
    alert('先选择一些小屋元素再完成吧 🏡');
    return;
  }

  const canvas = document.getElementById('atmosphere-canvas');
  const layerBg = document.getElementById('atmos-layer-bg');
  const layerBase = document.getElementById('atmos-layer-base');
  const layerFurn = document.getElementById('atmos-layer-furniture');
  const layerChar = document.getElementById('atmos-layer-character');
  const overlay = document.getElementById('atmos-anim-overlay');
  const animText = document.getElementById('atmos-anim-text');
  const fusionEls = canvas.querySelectorAll('.layer-fusion, .layer-vignette');

  // 进入动画模式
  canvas.classList.add('animating');
  // 隐藏融合层
  fusionEls.forEach(el => el.style.opacity = '0');
  // 隐藏基底、家具、人物
  layerBase.classList.add('anim-hidden');
  layerFurn.querySelectorAll('.furniture-item').forEach(el => {
    el.classList.add('anim-hidden');
    el.classList.remove('anim-show');
  });
  layerChar.querySelectorAll('.character-item').forEach(el => {
    el.classList.add('anim-hidden');
    el.classList.remove('anim-show');
  });

  // Phase 1: 显示遮罩 + 背景由远及近
  overlay.classList.add('show');
  animText.textContent = '远方，一片温柔的风景…';
  SoundFX.animBg();

  setTimeout(() => {
    if (bg) {
      layerBg.classList.add('anim-zoom');
      void layerBg.offsetWidth;
      setTimeout(() => {
        layerBg.classList.add('show');
        overlay.classList.remove('show');
      }, 100);
    } else {
      layerBg.style.opacity = '1';
      overlay.classList.remove('show');
    }
  }, 600);

  // Phase 2: 镜头推进到小屋基底
  setTimeout(() => {
    animText.textContent = '小屋渐渐清晰…';
    SoundFX.animBase();
    if (base) {
      layerBase.classList.remove('anim-hidden');
      layerBase.classList.add('show');
    }
  }, 2000);

  // Phase 3: 家具逐个浮现
  setTimeout(() => {
    const furnItems = layerFurn.querySelectorAll('.furniture-item');
    furnItems.forEach((el, idx) => {
      setTimeout(() => {
        el.classList.remove('anim-hidden');
        el.classList.add('anim-show');
      }, idx * 200);
    });
  }, 3200);

  // Phase 4: 人物浮现
  const furnDelay = furniture.length * 200 + 500;
  setTimeout(() => {
    const charItems = layerChar.querySelectorAll('.character-item');
    charItems.forEach((el, idx) => {
      setTimeout(() => {
        el.classList.remove('anim-hidden');
        el.classList.add('anim-show');
      }, idx * 250);
    });
    // 显示融合层
    fusionEls.forEach(el => {
      el.style.opacity = '';
      el.classList.add('show');
    });
  }, 3200 + furnDelay);

  // Phase 5: 显示结果文案
  const totalDelay = 3200 + furnDelay + characters.length * 250 + 800;
  setTimeout(() => {
    canvas.classList.remove('animating');
    SoundFX.complete();
    showAtmosphereResult();
    STATE.atmosphereState.done = true;
    saveToStorage();
  }, totalDelay);
}

// ====== 氛围小屋：基于用户实际选择的动态心理分析 ======

// 采样图片平均色彩（用于色彩心理学分析）
function sampleAvgColor(imgEl) {
  if (!imgEl || !imgEl.complete || imgEl.naturalWidth === 0) return null;
  try {
    const c = document.createElement('canvas');
    c.width = 10; c.height = 10;
    const ctx = c.getContext('2d');
    ctx.drawImage(imgEl, 0, 0, 10, 10);
    const d = ctx.getImageData(0, 0, 10, 10).data;
    let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
    r = Math.round(r / n); g = Math.round(g / n); b = Math.round(b / n);
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    let temp, tone;
    if (r > g + 12 && r >= b + 8) temp = 'warm';
    else if ((b > r + 8) || (g > r + 18 && b >= r)) temp = 'cool';
    else temp = 'neutral';
    if (lum > 185) tone = '明亮';
    else if (lum > 120) tone = '柔和';
    else tone = '沉静';
    return { r, g, b, temp, tone, lum: Math.round(lum) };
  } catch (e) { return null; }
}

// 汇总用户选择的结构化指标
function analyzeAtmosphereChoices() {
  const { bg, base, furniture, characters } = STATE.atmosphereState;
  const furn = furniture.map(f => ({ ...f, x: parseFloat(f.x), y: parseFloat(f.y), w: parseFloat(f.w || 100) }));
  const chars = characters.map(c => ({ ...c, x: parseFloat(c.x), y: parseFloat(c.y), w: parseFloat(c.w || 100) }));
  const all = [...furn, ...chars];

  const funcFurn = furn.filter(f => (f.path || '').indexOf('/furniture/') >= 0).length;
  const decorItems = furn.filter(f => (f.path || '').indexOf('/desk-items/') >= 0).length;
  const charCount = chars.length;
  const totalObjects = all.length;

  let avgX = 50, avgY = 50, avgW = 100, spread = 0, balance = 0.5;
  if (all.length) {
    avgX = all.reduce((s, i) => s + i.x, 0) / all.length;
    avgY = all.reduce((s, i) => s + i.y, 0) / all.length;
    avgW = all.reduce((s, i) => s + i.w, 0) / all.length;
    if (all.length > 1) {
      spread = all.reduce((s, i) => s + Math.hypot(i.x - avgX, i.y - avgY), 0) / all.length;
    }
    const left = all.filter(i => i.x < 50).length;
    balance = left / all.length;
  }

  let density;
  if (totalObjects <= 1) density = '极简留白';
  else if (totalObjects <= 4) density = '疏朗舒适';
  else if (totalObjects <= 8) density = '丰富充实';
  else density = '密集包裹';

  let cluster;
  if (spread < 14) cluster = '聚拢成簇';
  else if (spread < 28) cluster = '自然分布';
  else cluster = '开阔分散';

  let symmetry;
  if (balance >= 0.4 && balance <= 0.6) symmetry = '左右均衡';
  else if (balance < 0.3 || balance > 0.7) symmetry = '明显偏侧';
  else symmetry = '轻微偏侧';

  let scale;
  if (avgW < 80) scale = '精致小巧';
  else if (avgW <= 120) scale = '适中';
  else scale = '醒目突出';

  const bgImg = document.querySelector('#atmos-layer-bg img');
  const baseImg = document.querySelector('#atmos-layer-base img');
  const bgColor = bgImg ? sampleAvgColor(bgImg) : null;
  const baseColor = baseImg ? sampleAvgColor(baseImg) : null;
  const colorTemp = bgColor ? bgColor.temp : (baseColor ? baseColor.temp : 'neutral');
  const hasFoundation = !!(bg && base);

  return { bg, base, funcFurn, decorItems, charCount, totalObjects,
    avgX, avgY, avgW, spread, balance, density, cluster, symmetry, scale,
    bgColor, baseColor, colorTemp, hasFoundation };
}

// 根据用户选择生成个性化的环境投射解读（替代原来的固定文本）
function buildAtmosphereInterpretation() {
  const m = analyzeAtmosphereChoices();
  const ref = `
          <p style="margin-top: 10px; font-size: 12px; color: var(--text-muted);">
            <strong>参考文献</strong><br>
            Altman, I. (1975). <em>The environment and social behavior</em>. Brooks/Cole.<br>
            Andersen, S. M., & Chen, S. (2002). The relational self: An interpersonal social-cognitive theory. <em>Psychological Review</em>, 109(4), 619–645.<br>
            Deci, E. L., & Ryan, R. M. (2000). The "what" and "why" of goal pursuits: Human needs and the self-determination of behavior. <em>Psychological Inquiry</em>, 11(4), 227–268.<br>
            Elliot, A. J., & Maier, M. A. (2012). Color-in-context theory. <em>Advances in Experimental Social Psychology</em>, 45, 61–125.<br>
            Hall, E. T. (1966). <em>The hidden dimension</em>. Doubleday.<br>
            Kalff, D. M. (1980). <em>Sandplay: A psychotherapeutic approach to the psyche</em>. Sigo Press.<br>
            Lowenfeld, M. (1979). <em>The world technique</em>. Allen & Unwin.<br>
            Proshansky, H. M., Fabian, A. K., & Kaminoff, R. (1983). Place-identity: Physical world socialization of the self. <em>Journal of Environmental Psychology</em>, 3(1), 57–83.<br>
            Winnicott, D. W. (1971). <em>Playing and reality</em>. Tavistock Publications.
          </p>`;

  // 一、理论框架（结合完整度）
  let p1;
  if (m.hasFoundation) p1 = '你为小屋同时选择了远景背景与建筑基底，这意味着你建构的是一个"有地基、有天空"的完整世界。';
  else if (m.bg || m.base) p1 = '你选择了背景或基底之一，为这个空间奠定了部分基础，但留有一处留白。';
  else p1 = '你没有选择背景与基底，而是直接以散落的物件构筑空间，这本身就带有一种"漂浮"的特质。';

  // 二-1 密度
  let densityDesc;
  if (m.density === '极简留白') densityDesc = `你只放置了 ${m.totalObjects} 件物品，整体处于"极简留白"状态。大量留白往往意味着此刻你需要更充裕的心理呼吸空间，让内在得以舒展，而非被填满。`;
  else if (m.density === '疏朗舒适') densityDesc = `你共放置了 ${m.totalObjects} 件物品，密度处于"疏朗舒适"区间——既有陪伴，又不拥挤，是一种张弛有度的自我照料。`;
  else if (m.density === '丰富充实') densityDesc = `你共放置了 ${m.totalObjects} 件物品，密度进入"丰富充实"区间。较多的物品在心理层面模拟了"被环绕、被拥抱"的触觉体验，可能反映此刻对充实感与安全包裹的渴望。`;
  else densityDesc = `你共放置了 ${m.totalObjects} 件物品，密度达到"密集包裹"程度。这样高密度的布置常出现在需要强烈感官安抚、希望把自己"藏"进一个柔软容器里的时候。`;

  const composition = [];
  if (m.funcFurn) composition.push(`功能性家具 ${m.funcFurn} 件`);
  if (m.decorItems) composition.push(`个性摆件 ${m.decorItems} 件`);
  if (m.charCount) composition.push(`人物 ${m.charCount} 个`);
  const compStr = composition.length ? `（其中${composition.join('、')}）` : '';

  // 二-2 色彩（基于真实采样）
  let colorDesc;
  if (m.bgColor) {
    const t = m.bgColor.temp, tone = m.bgColor.tone;
    if (t === 'warm') colorDesc = `我们对你选择的背景做了平均色彩采样，结果偏向暖色系、整体${tone}。依据色彩-情境关联理论（Elliot & Maier, 2012），暖色调会激活社会接近动机，促进温暖感与联结感——你此刻似乎在主动为自己调取一份温度。`;
    else if (t === 'cool') colorDesc = `背景的平均色彩采样偏向冷色系、整体${tone}。冷色调有助于降低生理唤醒、促进平静与沉思——这像是一次有意识的"降温"自我调节，让心绪慢下来。`;
    else colorDesc = `背景的平均色彩采样呈中性色调、整体${tone}。中性色提供心理"锚定"，帮助稳定波动的情绪，是一种温和的自我稳态策略。`;
  } else {
    colorDesc = `你本次未选择背景，因此色彩层面的自我调节信号主要体现在物品本身。色彩-情境关联理论（Elliot & Maier, 2012）提示，未来若加入背景色，可作为一次轻量的情绪干预。`;
  }

  // 二-3 过渡性空间
  let transDesc;
  if (m.hasFoundation && m.totalObjects >= 3) transDesc = `远景、基底与多件物品共同构成一个层次完整的过渡性空间，它"既属于你又独立于你"，是承载情感、消化体验的安全容器。`;
  else if (m.totalObjects > 0) transDesc = `这些散落的物品已经在你与外部世界之间撑开了一个小小的过渡性空间——即便不完整，它依然是孵化意义的中间区域。`;
  else transDesc = `过渡性空间（Winnicott, 1971）需要一些"既内又外"的客体来撑开，目前空间还很轻盈，随时可以继续生长。`;

  // 二-4 数字沙盘 / 空间构图
  const layoutStr = `质心位于横向 ${m.avgX.toFixed(0)}%、纵向 ${m.avgY.toFixed(0)}%，空间分布"${m.cluster}"，左右构图"${m.symmetry}"，平均尺寸"${m.scale}"`;
  let layoutInterp;
  if (m.cluster === '聚拢成簇') layoutInterp = `聚拢成簇的布局常对应一种"向心、收束"的心理倾向，仿佛把能量收拢到一个安全的内核。`;
  else if (m.cluster === '开阔分散') layoutInterp = `开阔分散的布局则带有"向外舒展、不设防"的质感，呼应此刻对自由与呼吸感的需要。`;
  else layoutInterp = `自然分布的布局既不紧绷也不涣散，是一种放松而有节制的内在节奏。`;
  let symInterp;
  if (m.symmetry === '左右均衡') symInterp = `左右均衡的构图映射出对和谐与秩序的潜在偏好。`;
  else if (m.symmetry === '明显偏侧') symInterp = `明显偏侧的构图则带有一种动态张力，更接近自发性而非刻意平衡。`;
  else symInterp = `轻微偏侧的构图在秩序与随性之间留有余地。`;
  const scaleInterp = m.scale === '适中' ? '适中，既不喧宾夺主也不微不足道' : (m.scale === '精致小巧' ? '偏小，流露出对细腻细节的在意' : '偏大，强调醒目的存在感与主体性');
  const sandplayDesc = `作为一次"数字沙盘"（Kalff, 1980），你的空间构图值得被凝视：${layoutStr}。${layoutInterp}${symInterp}平均尺寸${scaleInterp}。`;

  // 二-5 人物与关系性自我
  let charDesc;
  if (m.charCount === 0) charDesc = `你未在小屋中放置任何人物，这是一次纯粹的"独处"选择。关系自我理论（Andersen & Chen, 2002）并不把独处视为孤立，而是自我修复与内省的必要时刻——此刻的空间只属于你自己。`;
  else if (m.charCount === 1) charDesc = `你放置了 1 个人物，独自在场。这往往指向自我对话与个体反思：有"我"在，但重心向内。`;
  else charDesc = `你放置了 ${m.charCount} 个人物，引入了明显的关系性维度。多人同框常表达对陪伴、联结与归属的渴望，也提示此刻"被看见、被回应"对你很重要。`;

  return `
          <p style="font-weight:600;color:var(--text);">一、理论框架：空间建构作为自我表达</p>
          <p>环境心理学认为，个体对物理空间的主动建构与装饰选择，是其内在心理状态的外化投射（Proshansky, Fabian, & Kaminoff, 1983）。${p1}依据"环境自决"（Environmental Self-Determination）概念，当你能自主地组织所处环境时，自主性与胜任感需要得到满足，进而促进心理福祉（Deci & Ryan, 2000）。你对空间每一寸的控制权本身，就是疗愈性的。</p>

          <p style="font-weight:600;color:var(--text);margin-top:12px;">二、基于你本次选择的具体分析</p>
          <p><strong>1. 个人空间需求与摆放密度</strong><br>
          ${densityDesc}${compStr}Hall（1966）的近体学理论与 Altman（1975）的隐私调节模型指出，个人空间是动态调节的——你此刻的密度选择，正是在虚拟空间中执行这种调节。</p>

          <p style="margin-top:8px;"><strong>2. 色彩心理学与背景选择</strong><br>
          ${colorDesc}</p>

          <p style="margin-top:8px;"><strong>3. 过渡性空间的心理功能</strong><br>
          ${transDesc}</p>

          <p style="margin-top:8px;"><strong>4. 数字沙盘与空间构图</strong><br>
          ${sandplayDesc}</p>

          <p style="margin-top:8px;"><strong>5. 人物形象与关系性自我</strong><br>
          ${charDesc}</p>

          <p style="font-weight:600;color:var(--text);margin-top:12px;">三、温柔的提醒</p>
          <p>以上分析不是诊断，而是一面镜子。你无意识中做出的选择，往往比有意识的思考更接近内心真实。安静地凝视你搭建的小屋，让它向你"说话"——环境与心灵的对话是双向的：你塑造空间，空间也在塑造你。</p>
          ${ref}
`;
}

function showAtmosphereResult() {
  const { bg, base, furniture, characters } = STATE.atmosphereState;
  const resultDiv = document.getElementById('atmosphere-result');

  const totalItems = furniture.length + characters.length;
  const m = analyzeAtmosphereChoices();
  let resonance = '你的氛围小屋是一个独一无二的情绪空间。';
  if (bg && base && totalItems >= 5) {
    resonance = '你精心布置了一个充满细节的情绪小窝，从远处的风景到屋内的每一件小物，都在默默守护着你的心情。这个空间完整而温暖，就像你内心深处渴望被安放的那一部分。';
  } else if (bg && base && totalItems >= 2) {
    resonance = '你的小屋有温暖的基底，也有点缀其中的小心思。不需要太满，刚刚好就是最美的状态。';
  } else if (bg || base) {
    resonance = '哪怕只是简单的背景和基底，也已经是一个可以安放情绪的开始。空间不需要立刻完美，它会随着你的心情慢慢生长。';
  } else if (totalItems > 0) {
    resonance = '你选择了一些温暖的小物件，它们散落在空间中，像星星一样点缀着你的心情。';
  }
  // 附上一句基于实际选择的构图速写
  const compParts = [];
  compParts.push(`共 ${m.totalObjects} 件物件`);
  compParts.push(`密度「${m.density}」`);
  if (m.colorTemp === 'warm') compParts.push('暖色调背景');
  else if (m.colorTemp === 'cool') compParts.push('冷色调背景');
  if (m.charCount === 0) compParts.push('独处空间');
  else if (m.charCount === 1) compParts.push('一人独处');
  else compParts.push(`${m.charCount} 人同框`);
  const sketch = compParts.join(' · ');

  resultDiv.classList.remove('hidden');
  resultDiv.innerHTML = `
    <div class="sticker-result">
      <div class="resonance-box">
        <div class="resonance-text">${resonance}</div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-muted);letter-spacing:0.5px;">${sketch}</div>
      </div>
      <div class="collapse-wrap">
        <div class="collapse-trigger" onclick="toggleCollapse('atmos-interpret')">
          <span class="arrow">▸</span> 环境投射解读（APA7）
        </div>
        <div class="collapse-content" id="atmos-interpret">
          ${buildAtmosphereInterpretation()}
        </div>
      </div>
      <div style="margin-top: 16px; padding: 20px; background: #fcede8; border-radius: 16px;">
        <div style="font-size: 48px; margin-bottom: 8px;">🌅</div>
        <div style="font-size: 16px; font-weight: 600; color: var(--text);">氛围小屋·情绪贴纸</div>
        <div style="font-size: 13px; color: var(--text-light); margin-top: 4px;">已存入「我的情绪旅程」</div>
      </div>
      <div class="btn-center-row mt-16">
        <button class="btn-primary" onclick="addStickerAndBack('🌅', '氛围小屋·情绪空间', 'calm')">💾 保存贴纸并返回</button>
      </div>
    </div>
  `;
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function initAtmosphere() {
  const state = STATE.atmosphereState;
  // 清除动画状态
  const canvas = document.getElementById('atmosphere-canvas');
  canvas.classList.remove('animating');
  const layerBg = document.getElementById('atmos-layer-bg');
  const layerBase = document.getElementById('atmos-layer-base');
  const layerFurniture = document.getElementById('atmos-layer-furniture');
  const layerCharacter = document.getElementById('atmos-layer-character');
  layerBg.classList.remove('anim-zoom', 'show');
  layerBase.classList.remove('anim-hidden', 'show');
  canvas.querySelectorAll('.anim-hidden, .anim-show').forEach(el => {
    el.classList.remove('anim-hidden', 'anim-show');
  });
  canvas.querySelectorAll('.layer-fusion, .layer-vignette').forEach(el => {
    el.style.opacity = '';
    el.classList.remove('show');
  });
  document.getElementById('atmos-anim-overlay').classList.remove('show');
  const resultDiv = document.getElementById('atmosphere-result');
  resultDiv.classList.add('hidden');
  resultDiv.innerHTML = '';
  // 初始化取消选中
  initAtmosCanvasDeselect();
  // 初始化画布缩放（滚轮 + 双指），并重置缩放比例
  atmosCanvasScale = 1;
  applyAtmosCanvasScale();
  atmosPinching = false;
  initAtmosCanvasZoom();
  // 恢复背景
  layerBg.innerHTML = '';
  canvas.classList.remove('has-bg');
  if (state.bg) {
    selectAtmosBg(state.bg, true);
  }
  // 恢复基底
  layerBase.innerHTML = '';
  if (state.base) {
    selectAtmosBase(state.base, true);
  }
  // 恢复家具
  layerFurniture.innerHTML = '';
  layerCharacter.innerHTML = '';
  // 重新添加（从保存的状态）
  state.furniture.forEach(item => {
    const el = createAtmosItem('furniture-item', item.id, item.path, item.x, item.y, item.w, '家具');
    layerFurniture.appendChild(el);
    setupAtmosInteraction(el);
    processAtmosImage(el.querySelector('img'));
  });
  state.characters.forEach(item => {
    const el = createAtmosItem('character-item', item.id, item.path, item.x, item.y, item.w, '人物');
    layerCharacter.appendChild(el);
    setupAtmosInteraction(el);
    processAtmosImage(el.querySelector('img'));
  });
  updateAtmosPlaceholder();
  updateAtmosSelectedInfo();
  switchAtmosTab('backgrounds');
}
