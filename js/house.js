// =============================================================
// 模块1: 极简小屋
// =============================================================
function selectHouseBase(val) {
  STATE.houseState.base = val;
  document.querySelectorAll('#house-base-select .house-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.value === val);
  });
  updateHousePreview();
}

function selectHouseBg(val) {
  STATE.houseState.bg = val;
  document.querySelectorAll('#house-bg-select .house-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.value === val);
  });
  updateHousePreview();
}

function selectHouseMood(val) {
  STATE.houseState.mood = val;
  SoundFX.setMood(val);
  document.querySelectorAll('#house-mood-select .mood-opt').forEach(el => {
    el.classList.toggle('selected', el.dataset.value === val);
  });
  updateHousePreview();
}

function toggleDeco(val) {
  const idx = STATE.houseState.decos.indexOf(val);
  if (idx > -1) {
    STATE.houseState.decos.splice(idx, 1);
  } else {
    STATE.houseState.decos.push(val);
  }
  document.querySelectorAll('#house-deco-grid .deco-item').forEach(el => {
    el.classList.toggle('selected', STATE.houseState.decos.includes(el.dataset.value));
  });
  updateHousePreview();
}

function selectDiy(cat, val) {
  STATE.houseState.diy[cat] = val;
  const container = document.getElementById(`diy-${cat}`);
  if (container) {
    container.querySelectorAll('.diy-opt').forEach(el => {
      el.classList.toggle('selected', el.dataset.value === val);
    });
  }
  updateHousePreview();
}

function updateHousePreview() {
  const preview = document.getElementById('house-preview');
  const { base, bg, mood, decos, diy } = STATE.houseState;

  if (!base && !bg) {
    preview.innerHTML = `<div class="house-preview-placeholder">选择元素开始搭建吧 🏡<br><span style="font-size:12px;">先选一个小屋基底和背景氛围</span></div>`;
    return;
  }

  // 背景渐变
  const bgGradients = {
    sunset: 'linear-gradient(180deg, #fde8d8 0%, #fcd8c8 40%, #f5c8b8 70%, #e8d5cf 100%)',
    night: 'linear-gradient(180deg, #2a3550 0%, #3a4565 30%, #4a5575 60%, #5a6585 100%)',
    forest: 'linear-gradient(180deg, #d8e8d0 0%, #c8e0c0 40%, #b8d8b0 70%, #a8c9b8 100%)'
  };
  const bgElements = {
    sunset: `<circle cx="80" cy="45" r="22" fill="#f5b890" opacity="0.7"/><circle cx="280" cy="40" r="3" fill="#fff" opacity="0.4"/>`,
    night: `<circle cx="50" cy="35" r="15" fill="#f5e8d0" opacity="0.8"/><circle cx="50" cy="32" r="13" fill="#3a4565"/><circle cx="100" cy="20" r="1.5" fill="#fff"/><circle cx="150" cy="30" r="1" fill="#fff"/><circle cx="220" cy="15" r="1.5" fill="#fff"/><circle cx="270" cy="25" r="1" fill="#fff"/><circle cx="300" cy="40" r="1.5" fill="#fff"/>`,
    forest: `<path d="M0 30 Q15 15 30 30 Q45 15 60 30" fill="none" stroke="#b8d8b0" stroke-width="2" opacity="0.4"/><circle cx="250" cy="25" r="8" fill="#f0d8a0" opacity="0.5"/>`
  };

  // 小屋SVG生成 - 根据基底类型生成不同的真实房屋结构
  const houseSVG = generateHouseSVG(base, bg, mood, decos, diy);
  const moodEmojis = { calm: '🕊️', happy: '🌸', sad: '🌧️', anxious: '🍃', warm: '☕' };
  const moodColors = { calm: '#a8c9b8', happy: '#e8b4b8', sad: '#b5cce0', anxious: '#c4b5d4', warm: '#f0c8b8' };

  preview.innerHTML = `
    <svg viewBox="0 0 320 240" style="width:100%;height:100%;display:block;" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${bg === 'night' ? '#2a3550' : bg === 'forest' ? '#d8e8d0' : '#fde8d8'}"/>
          <stop offset="100%" stop-color="${bg === 'night' ? '#4a5575' : bg === 'forest' ? '#a8c9b8' : '#e8d5cf'}"/>
        </linearGradient>
      </defs>
      <rect width="320" height="240" fill="url(#bgGrad)"/>
      ${bgElements[bg] || ''}
      ${houseSVG}
      ${mood ? `<text x="160" y="20" text-anchor="middle" font-size="14" fill="${bg === 'night' ? '#fff' : '#8a7a74'}" opacity="0.7">${moodEmojis[mood]}</text>` : ''}
    </svg>
  `;
}

// 生成真实小屋SVG结构
function generateHouseSVG(base, bg, mood, decos, diy) {
  const skinColors = { light: '#f5d0b8', medium: '#e8c4a8', tan: '#d4a888' };
  const outfitEmojis = { casual: '👕', dress: '👗', cozy: '🧶' };
  const accesEmojis = { none: '', hat: '🎀', glasses: '👓', scarf: '🧣' };
  const skin = skinColors[diy.skin] || '#f5d0b8';
  const outfit = outfitEmojis[diy.outfit] || '👕';
  const acces = accesEmojis[diy.acces] || '';

  // 根据情绪选择小人动作
  const moodActions = {
    calm: { pose: '坐姿', arms: '放膝盖上' },
    happy: { pose: '跳跃', arms: '举起' },
    sad: { pose: '低头坐', arms: '抱膝' },
    anxious: { pose: '站立', arms: '交叉' },
    warm: { pose: '靠墙', arms: '抱杯' }
  };

  let house = '';

  if (base === 'classic') {
    // 经典小屋：斜屋顶 + 矩形墙体 + 门窗
    house = `
      <!-- 地面 -->
      <ellipse cx="160" cy="215" rx="140" ry="15" fill="${bg === 'forest' ? '#9ec8a0' : '#d8c8b8'}" opacity="0.6"/>
      <!-- 小屋主体 -->
      <!-- 屋顶 -->
      <path d="M70 110 L160 65 L250 110 Z" fill="#d4a0b0" stroke="#b08090" stroke-width="2" stroke-linejoin="round"/>
      <!-- 烟囱 -->
      <rect x="210" y="75" width="16" height="25" rx="2" fill="#e8c4b0" stroke="#c4a890" stroke-width="1.5"/>
      <rect x="207" y="72" width="22" height="6" rx="2" fill="#c4a890"/>
      <!-- 炊烟 -->
      <path d="M218 72 Q215 60 220 50 Q225 40 218 30" stroke="${bg === 'night' ? '#ddd' : '#bbb'}" stroke-width="2" fill="none" opacity="0.5" stroke-linecap="round"/>
      <!-- 墙体 -->
      <rect x="85" y="110" width="150" height="95" rx="4" fill="${bg === 'night' ? '#f5e8c8' : '#faecc8'}" stroke="#d4b890" stroke-width="2"/>
      <!-- 门 -->
      <path d="M140 205 L140 155 Q140 148 147 148 L173 148 Q180 148 180 155 L180 205 Z" fill="#c4a0b0" stroke="#a08090" stroke-width="2"/>
      <circle cx="172" cy="178" r="2.5" fill="#8a6070"/>
      <!-- 窗户 -->
      <rect x="100" y="130" width="28" height="28" rx="2" fill="${bg === 'night' ? '#f0d878' : '#b8d4e8'}" stroke="#8aa0b0" stroke-width="1.5"/>
      <line x1="114" y1="130" x2="114" y2="158" stroke="#8aa0b0" stroke-width="1"/>
      <line x1="100" y1="144" x2="128" y2="144" stroke="#8aa0b0" stroke-width="1"/>
      <rect x="192" y="130" width="28" height="28" rx="2" fill="${bg === 'night' ? '#f0d878' : '#b8d4e8'}" stroke="#8aa0b0" stroke-width="1.5"/>
      <line x1="206" y1="130" x2="206" y2="158" stroke="#8aa0b0" stroke-width="1"/>
      <line x1="192" y1="144" x2="220" y2="144" stroke="#8aa0b0" stroke-width="1"/>
    `;
  } else if (base === 'treehouse') {
    // 树屋：树干 + 树冠 + 木屋
    house = `
      <!-- 地面 -->
      <ellipse cx="160" cy="215" rx="140" ry="15" fill="${bg === 'forest' ? '#9ec8a0' : '#d8c8b8'}" opacity="0.6"/>
      <!-- 树干 -->
      <path d="M140 215 L145 130 L175 130 L180 215 Z" fill="#b89070" stroke="#8a6850" stroke-width="2"/>
      <!-- 树枝 -->
      <path d="M155 140 Q130 135 120 150" stroke="#8a6850" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M165 135 Q190 128 200 145" stroke="#8a6850" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- 树冠 -->
      <ellipse cx="120" cy="135" rx="25" ry="20" fill="#a8c9a0" stroke="#88a888" stroke-width="1.5"/>
      <ellipse cx="200" cy="130" rx="28" ry="22" fill="#a8c9a0" stroke="#88a888" stroke-width="1.5"/>
      <ellipse cx="160" cy="115" rx="35" ry="25" fill="#b8d8b0" stroke="#88a888" stroke-width="1.5"/>
      <!-- 树屋主体 -->
      <rect x="125" y="105" width="70" height="45" rx="3" fill="#c4a888" stroke="#8a6850" stroke-width="2"/>
      <!-- 树屋顶 -->
      <path d="M118 108 L160 88 L202 108 Z" fill="#a8907a" stroke="#7a5840" stroke-width="2" stroke-linejoin="round"/>
      <!-- 树屋小窗 -->
      <rect x="135" y="118" width="16" height="16" rx="2" fill="${bg === 'night' ? '#f0d878' : '#b8d4e8'}" stroke="#7a5840" stroke-width="1"/>
      <rect x="169" y="118" width="16" height="16" rx="2" fill="${bg === 'night' ? '#f0d878' : '#b8d4e8'}" stroke="#7a5840" stroke-width="1"/>
      <!-- 树屋门 -->
      <rect x="150" y="125" width="20" height="25" rx="2" fill="#9a7858" stroke="#7a5840" stroke-width="1.5"/>
      <!-- 梯子 -->
      <line x1="160" y1="150" x2="160" y2="210" stroke="#8a6850" stroke-width="2"/>
      <line x1="153" y1="160" x2="167" y2="160" stroke="#8a6850" stroke-width="2"/>
      <line x1="153" y1="175" x2="167" y2="175" stroke="#8a6850" stroke-width="2"/>
      <line x1="153" y1="190" x2="167" y2="190" stroke="#8a6850" stroke-width="2"/>
    `;
  } else if (base === 'igloo') {
    // 圆顶小屋
    house = `
      <!-- 地面 -->
      <ellipse cx="160" cy="215" rx="140" ry="15" fill="${bg === 'forest' ? '#9ec8a0' : bg === 'night' ? '#5a6585' : '#d8c8b8'}" opacity="0.6"/>
      <!-- 圆顶 -->
      <path d="M85 180 Q85 90 160 90 Q235 90 235 180 Z" fill="${bg === 'night' ? '#d8e0e8' : '#e8eef4'}" stroke="#a8b8c8" stroke-width="2"/>
      <!-- 砖纹 -->
      <path d="M105 130 Q160 120 215 130" stroke="#b8c8d8" stroke-width="1" fill="none" opacity="0.5"/>
      <path d="M95 155 Q160 148 225 155" stroke="#b8c8d8" stroke-width="1" fill="none" opacity="0.5"/>
      <path d="M90 175 Q160 170 230 175" stroke="#b8c8d8" stroke-width="1" fill="none" opacity="0.5"/>
      <line x1="130" y1="100" x2="135" y2="125" stroke="#b8c8d8" stroke-width="1" opacity="0.5"/>
      <line x1="160" y1="90" x2="160" y2="120" stroke="#b8c8d8" stroke-width="1" opacity="0.5"/>
      <line x1="190" y1="100" x2="185" y2="125" stroke="#b8c8d8" stroke-width="1" opacity="0.5"/>
      <!-- 入口 -->
      <path d="M145 205 L145 165 Q145 155 160 155 Q175 155 175 165 L175 205 Z" fill="#5a7080" stroke="#4a6070" stroke-width="2"/>
      <!-- 小窗 -->
      <circle cx="120" cy="140" r="8" fill="${bg === 'night' ? '#f0d878' : '#b8d4e8'}" stroke="#8aa0b0" stroke-width="1.5"/>
      <line x1="120" y1="132" x2="120" y2="148" stroke="#8aa0b0" stroke-width="0.8"/>
      <line x1="112" y1="140" x2="128" y2="140" stroke="#8aa0b0" stroke-width="0.8"/>
      <circle cx="200" cy="140" r="8" fill="${bg === 'night' ? '#f0d878' : '#b8d4e8'}" stroke="#8aa0b0" stroke-width="1.5"/>
      <line x1="200" y1="132" x2="200" y2="148" stroke="#8aa0b0" stroke-width="0.8"/>
      <line x1="192" y1="140" x2="208" y2="140" stroke="#8aa0b0" stroke-width="0.8"/>
    `;
  }

  // 摆件位置 - 自然摆放在屋内外
  const decoPositions = {
    plant: { x: 95, y: 200, label: '🌱' },        // 门前左侧
    book: { x: 108, y: 200, label: '📚' },         // 门前左侧
    candle: { x: 225, y: 200, label: '🕯️' },       // 门前右侧
    tea: { x: 240, y: 200, label: '🍵' },          // 门前右侧
    cloud: { x: 270, y: 60, label: '☁️' },         // 天空
    star: { x: 45, y: 50, label: '⭐' },           // 天空左
    cat: { x: 70, y: 205, label: '🐱' },           // 地面左侧
    flower: { x: 285, y: 205, label: '🌸' },       // 地面右侧
    rainbow: { x: 50, y: 80, label: '🌈' }         // 天空左上
  };

  let decosHTML = '';
  decos.forEach(d => {
    const pos = decoPositions[d];
    if (pos) {
      decosHTML += `<text x="${pos.x}" y="${pos.y}" font-size="18" text-anchor="middle">${pos.label}</text>`;
    }
  });

  // 小人 - 根据情绪显示不同动作，放在屋前
  let characterHTML = '';
  if (mood) {
    const charX = 160;
    const charY = 200;
    const action = moodActions[mood] || moodActions.calm;

    if (mood === 'happy') {
      // 跳跃小人
      characterHTML = `
        <g transform="translate(${charX-15},${charY-40})">
          <!-- 头 -->
          <circle cx="15" cy="10" r="9" fill="${skin}" stroke="#8a6850" stroke-width="1.5"/>
          ${acces === '🎀' ? '<text x="15" y="2" text-anchor="middle" font-size="8">🎀</text>' : ''}
          ${acces === '👓' ? '<circle cx="12" cy="10" r="3" fill="none" stroke="#4a4a4a" stroke-width="1"/><circle cx="18" cy="10" r="3" fill="none" stroke="#4a4a4a" stroke-width="1"/>' : ''}
          ${acces === '🧣' ? '<rect x="10" y="17" width="10" height="3" fill="#c4a8a0"/>' : ''}
          <!-- 身体+举起的手 -->
          <path d="M10 20 L20 20 L22 25 L20 32 L10 32 L8 25 Z" fill="${outfit === '👗' ? '#e8b4b8' : outfit === '🧶' ? '#c4b5d4' : '#a8c9b8'}" stroke="#7a6858" stroke-width="1"/>
          <!-- 举起的手 -->
          <line x1="8" y1="22" x2="2" y2="12" stroke="${skin}" stroke-width="3" stroke-linecap="round"/>
          <line x1="22" y1="22" x2="28" y2="12" stroke="${skin}" stroke-width="3" stroke-linecap="round"/>
          <!-- 腿 -->
          <line x1="13" y1="32" x2="11" y2="40" stroke="${skin}" stroke-width="3" stroke-linecap="round"/>
          <line x1="17" y1="32" x2="19" y2="40" stroke="${skin}" stroke-width="3" stroke-linecap="round"/>
        </g>
      `;
    } else if (mood === 'sad') {
      // 低头坐姿小人
      characterHTML = `
        <g transform="translate(${charX-12},${charY-20})">
          <!-- 头(低着) -->
          <circle cx="12" cy="8" r="8" fill="${skin}" stroke="#8a6850" stroke-width="1.5"/>
          ${acces === '🎀' ? '<text x="12" y="1" text-anchor="middle" font-size="7">🎀</text>' : ''}
          <!-- 身体蜷缩 -->
          <path d="M8 16 L16 16 L18 22 L16 24 L8 24 L6 22 Z" fill="${outfit === '👗' ? '#e8b4b8' : outfit === '🧶' ? '#c4b5d4' : '#a8c9b8'}" stroke="#7a6858" stroke-width="1"/>
          <!-- 抱膝的手 -->
          <path d="M6 18 Q3 20 6 22" stroke="${skin}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <path d="M18 18 Q21 20 18 22" stroke="${skin}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        </g>
      `;
    } else if (mood === 'calm') {
      // 平静坐姿
      characterHTML = `
        <g transform="translate(${charX-12},${charY-25})">
          <circle cx="12" cy="8" r="8" fill="${skin}" stroke="#8a6850" stroke-width="1.5"/>
          ${acces === '🎀' ? '<text x="12" y="1" text-anchor="middle" font-size="7">🎀</text>' : ''}
          ${acces === '👓' ? '<circle cx="9" cy="8" r="2.5" fill="none" stroke="#4a4a4a" stroke-width="0.8"/><circle cx="15" cy="8" r="2.5" fill="none" stroke="#4a4a4a" stroke-width="0.8"/>' : ''}
          <path d="M7 16 L17 16 L18 24 L16 28 L8 28 L6 24 Z" fill="${outfit === '👗' ? '#e8b4b8' : outfit === '🧶' ? '#c4b5d4' : '#a8c9b8'}" stroke="#7a6858" stroke-width="1"/>
          <line x1="8" y1="24" x2="6" y2="28" stroke="${skin}" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="16" y1="24" x2="18" y2="28" stroke="${skin}" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      `;
    } else if (mood === 'anxious') {
      // 站立双手交叉
      characterHTML = `
        <g transform="translate(${charX-12},${charY-38})">
          <circle cx="12" cy="8" r="8" fill="${skin}" stroke="#8a6850" stroke-width="1.5"/>
          ${acces === '🎀' ? '<text x="12" y="1" text-anchor="middle" font-size="7">🎀</text>' : ''}
          <path d="M7 16 L17 16 L18 28 L16 34 L8 34 L6 28 Z" fill="${outfit === '👗' ? '#e8b4b8' : outfit === '🧶' ? '#c4b5d4' : '#a8c9b8'}" stroke="#7a6858" stroke-width="1"/>
          <!-- 交叉的手 -->
          <path d="M7 20 L17 22 M17 20 L7 22" stroke="${skin}" stroke-width="2" stroke-linecap="round"/>
          <line x1="9" y1="34" x2="8" y2="42" stroke="${skin}" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="15" y1="34" x2="16" y2="42" stroke="${skin}" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      `;
    } else if (mood === 'warm') {
      // 靠墙抱杯
      characterHTML = `
        <g transform="translate(${charX-12},${charY-28})">
          <circle cx="12" cy="8" r="8" fill="${skin}" stroke="#8a6850" stroke-width="1.5"/>
          ${acces === '🧣' ? '<rect x="7" y="14" width="10" height="3" fill="#c4a8a0"/>' : ''}
          ${acces === '🎀' ? '<text x="12" y="1" text-anchor="middle" font-size="7">🎀</text>' : ''}
          <path d="M7 16 L17 16 L18 26 L16 30 L8 30 L6 26 Z" fill="${outfit === '👗' ? '#e8b4b8' : outfit === '🧶' ? '#c4b5d4' : '#a8c9b8'}" stroke="#7a6858" stroke-width="1"/>
          <!-- 抱杯的手 -->
          <circle cx="12" cy="23" r="3" fill="#e8d5cf" stroke="#a08878" stroke-width="0.8"/>
          <path d="M7 22 L5 20 M17 22 L19 20" stroke="${skin}" stroke-width="2" stroke-linecap="round"/>
          <line x1="9" y1="30" x2="8" y2="36" stroke="${skin}" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="15" y1="30" x2="16" y2="36" stroke="${skin}" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      `;
    }
  }

  return house + decosHTML + characterHTML;
}

// ====== 极简小屋：温馨安慰话语 ======
function getHouseComfortMessage() {
  const { base, bg, mood, decos } = STATE.houseState;
  const moodNames = { calm: '平静', happy: '愉悦', sad: '低落', anxious: '焦虑', warm: '温暖' };
  const moodLabel = mood ? moodNames[mood] : '某种说不清的感受';
  const parts = [];

  // 基于情绪标签的共情开头
  if (mood === 'sad') {
    parts.push(`看起来你好像有点低落。不过没关系，你刚刚亲手为自己搭建了一个可以安放这份情绪的小屋——能把"低落"说出来，本身就是一种勇敢。`);
  } else if (mood === 'anxious') {
    parts.push(`看起来你好像有点焦虑。不过你刚刚做了一件很好的事——你为自己创造了一个安全的小空间，焦虑在这里不需要被赶走，它只需要被看见。`);
  } else if (mood === 'calm') {
    parts.push(`看起来你现在挺平静的。你搭的这间小屋和你此刻的状态很像——安安静静的，不急不躁，这本身就是一种很珍贵的状态呢。`);
  } else if (mood === 'happy') {
    parts.push(`看起来你现在心情不错呀！你搭的小屋和你的心情一样明亮，这份快乐是你自己为自己找到的，很棒。`);
  } else if (mood === 'warm') {
    parts.push(`看起来你此刻心里是暖的。你选择的小屋里有光、有温度——你正在主动地照顾自己，这份温柔会一直陪着你。`);
  } else {
    parts.push(`你为自己搭了一间小屋。不管此刻什么感受，这个小屋都在替你说着一些你还没说出口的话。`);
  }

  // 基于"选择组合"的洞察
  if (base === 'treehouse' && bg === 'night') {
    parts.push(`你选了树屋+星空——这像是在说："我想待在一个看得见世界、又不会被世界打扰的地方。"这种"温柔的抽离"挺好的，不是在逃避，而是在给自己留出呼吸的余地。`);
  } else if (base === 'classic' && decos.length === 0) {
    parts.push(`你选了经典小屋、又没有加什么装饰——也许此刻你需要的不是更多东西，而是一个简单、确定的、属于自己的空间。简单就好。`);
  } else if (bg === 'forest') {
    parts.push(`你选了森林做背景——也许心里有些疲惫了，你的身体在悄悄告诉你："去有绿色的地方待一会儿吧。"`);
  } else if (decos.length >= 4) {
    parts.push(`你往小屋里放了不少小物件——也许此刻你需要被"包围"的感觉，每一件小东西都是你给自己的一个小小拥抱。`);
  }

  return parts.join(' ');
}

// ====== 极简小屋：基于用户实际选择的动态心理分析 ======
function buildHouseInterpretation() {
  const { base, bg, mood, decos, diy } = STATE.houseState;
  const ref = `<p style="margin-top: 10px; font-size: 12px; color: var(--text-muted);">
    <strong>参考文献</strong><br>
    Appleton, J. (1975). <em>The experience of landscape</em>. Wiley.<br>
    Deci, E. L., & Ryan, R. M. (2000). The "what" and "why" of goal pursuits. <em>Psychological Inquiry</em>, 11(4), 227–268.<br>
    Gross, J. J. (2015). Emotion regulation. <em>Psychological Inquiry</em>, 26(1), 1–26.<br>
    Kaplan, S. (1995). The restorative benefits of nature. <em>Journal of Environmental Psychology</em>, 15(3), 169–182.<br>
    Lieberman, M. D., et al. (2007). Putting feelings into words. <em>Psychological Science</em>, 18(5), 421–428.<br>
    Piff, P. K., et al. (2015). Awe, the small self, and prosocial behavior. <em>JPSP</em>, 108(6), 883–899.<br>
    Proshansky, H. M., et al. (1983). Place-identity. <em>Journal of Environmental Psychology</em>, 3(1), 57–83.<br>
    Rogers, C. R. (1959). A theory of therapy. In S. Koch (Ed.), <em>Psychology: A study of a science</em> (Vol. 3). McGraw-Hill.<br>
    Scannell, L., & Gifford, R. (2010). Defining place attachment. <em>Journal of Environmental Psychology</em>, 30(1), 1–10.
  </p>`;
  const baseNames = { classic: '经典小屋', treehouse: '树屋', igloo: '圆顶屋' };

  // 深度分析：为什么用户选了这个基底——揭示内心原因
  const baseInsights = {
    classic: `你选了"经典小屋"——方方正正、屋顶对称。这不是随手选的。Appleton（1975）的"庇护-眺望"理论告诉我们，这种最"标准"的房屋形态，在人类进化记忆中对应着最原始的庇护原型。当你此刻选择它，你的内心可能在说："我需要一个确定的、可预测的、不会有意外的地方。"也许最近的生活里有太多不确定，你的心理系统本能地退回到这个最安全的基本形——不是因为你无聊，而是因为你的内心在为自己寻找一个可以依靠的结构。`,
    treehouse: `你选了"树屋"——既在树上，又看得见远方。这个选择很有意思：树屋是一种"双重位置"——被树枝包裹（庇护），但又在高处俯瞰（眺望）。你此刻的内心，可能正处在一种矛盾中：一方面想躲起来、不被打扰，另一方面又不想完全切断与世界的联系。你选择了一个"既在又不在"的位置——既在世界上，又保持一点距离。这不是逃避，而是一种有分寸的自我保护：我需要空间，但我还没准备好完全关上门。`,
    igloo: `你选了"圆顶屋"——没有尖角，没有棱角，一切都是圆的。圆顶在空间心理学中对应着"包容"和"完整"。选择圆顶的人，此刻内心可能正在拒绝"被切割"的感觉——也许你最近经历了太多非此即彼、左右为难的处境，你厌倦了对立和冲突。圆顶说的是："我不想再被逼着选边站了，我想要一个能容纳所有面的空间。"你的内心在寻求一种整体性的接纳——好和坏、强和弱，都能在同一个圆里共存。`
  };
  const bgInsights = {
    sunset: `你选了"日落"做背景——暖橙色的天际线。Kaplan（1995）的注意力恢复理论指出，暖色调的环境能以"软性魅力"方式修复被消耗的注意力。但更重要的是：日落是一天中"结束"的时刻。你选了日落，也许是因为你此刻内心深处有一件事需要"收尾"——也许是一段疲惫的经历、一个纠缠的念头，你希望它像太阳一样，温暖地落下去，然后明天又是新的一天。你的内心在说："该歇歇了。"`,
    night: `你选了"星空"做背景——深邃的夜空和点点星光。Piff等人（2015）发现，星空带来的"敬畏体验"能让人缩小自我感、拓展时间感知。你选了星空，内心可能在说："最近的事太琐碎了，我想看到更大的东西。"当日常的烦心事挤满了内心，星空提供了一种"缩放"——在浩瀚面前，那些焦虑的事好像没那么大了。这不是逃避，而是一种健康的"心理降维"：在更大的尺度上重新校准什么才是重要的。`,
    forest: `你选了"森林"做背景——层层叠叠的绿色。Kaplan（1995）的自然恢复理论表明，绿色环境能实质性地降低皮质醇。但更深的层面是：森林是一种"被包裹"的感觉——树在四周，光从缝隙中落下。你选了森林，内心可能在说："我想被什么东西包围着，但不是人，而是自然。"也许你此刻需要一种"不被评判的陪伴"——树不会给你建议、不会问你问题，它们只是在那里。你想要的不是社交，而是存在感。`
  };
  const moodInsights = {
    calm: `你给自己标了"平静"。Lieberman等人（2007）的fMRI研究证明，把情绪命名为词语时，杏仁核活动会下降。但"平静"这个词的选择本身也透露着什么——你选了它，说明你此刻有能力审视自己的状态，并在众多情绪中准确地找到了它。这暗示你的内心资源是充足的，你没有被情绪淹没，而是在一个相对从容的位置上观察自己。`,
    happy: `你标了"愉悦"。Gross（2015）的情绪调节模型指出，主动选择进入愉悦场景本身就是一种高级调节策略。但值得注意的是：你在搭建小屋的过程中主动选择了"愉悦"这个标签——这意味着你此刻不是被动地"碰巧开心"，而是在有意识地为自己确认和延续这份好心情。你的内心在说："这个好的状态，我想留住它。"`,
    sad: `你标了"低落"。这需要勇气。Gross（2015）指出，承认负面情绪属于"认知重评"的高级形式。当你在五个选项中选择了"低落"，你的内心其实在说："我不想假装没事。"这座小屋就是你对这份低落的回应——你没有赶走它，而是给它造了一个家。这比强颜欢笑健康得多：情绪不需要被修复，它需要被接纳。`,
    anxious: `你标了"焦虑"。焦虑最难受的地方在于它是"弥散的"——你不知道它从哪来、往哪去。Lieberman等人（2007）的研究表明，给焦虑一个名字，就是在神经层面给它画一个边界。你选了"焦虑"这个词，内心其实在说："我看见你了。"这一步看起来小，但它是从"被焦虑裹挟"到"与焦虑共处"的转折点。`,
    warm: `你标了"温暖"。温暖是一种"接近性情绪"——它意味着你此刻内心有向外的渴望，渴望联结、渴望被滋养。你选了温暖，内心可能在说："我不想一个人冷着，我想被什么柔软的东西接住。"这不是软弱，而是心理系统在主动调取修复资源——你正在向自己发送一个信号：是时候对自己温柔一点了。`
  };

  // 装饰选择揭示什么
  let decoInsight;
  if (decos.length === 0) {
    decoInsight = `你一件装饰都没加。这不是"懒得选"——在环境心理学中，主动选择"空"本身就是一种强烈的选择。你的内心此刻可能在说："我不需要更多东西了，我需要的是空间。"也许最近接收了太多信息、太多要求，你的心理容量已经满了，你本能地拒绝再加入任何东西——哪怕是一个可爱的小摆件。这种"减法需求"值得被认真对待。`;
  } else if (decos.length <= 2) {
    decoInsight = `你只加了 ${decos.length} 件装饰：${decos.join('、')}。不多，但每一件都是你特意挑的。这种"少而精"的选择方式，反映了你此刻内心的节制感——你不想被淹没，但也不想完全空着。你选的不是"装饰"，而是"刚好够"的安全感。你的内心在说："我需要一点点温暖，但别太多，我怕承受不住。"`;
  } else {
    decoInsight = `你加了 ${decos.length} 件装饰：${decos.join('、')}。这么多物件填进一个小屋里，你的内心可能在说："我需要被填满。"也许此刻有一种空旷感或孤独感让你不舒服，你本能地用物件来填补它——每一件东西都是你给自己扔过去的一块砖，在砌一堵挡住空洞的墙。这不是问题，这是你此刻能找到的最好的自我安抚方式。`;
  }

  const moodNames = { calm: '平静', happy: '愉悦', sad: '低落', anxious: '焦虑', warm: '温暖' };

  // 综合洞察：把所有选择串起来看
  const comboParts = [];
  if (base === 'treehouse' && bg === 'night') comboParts.push('你想待在高处看星空——内心渴望一种"有距离感的辽阔"，也许最近的日常让你觉得太挤了');
  else if (base === 'classic' && decos.length === 0) comboParts.push('方正的小屋+不加装饰——你需要的是"确定性"和"留白"，内心可能正在经历信息过载');
  else if (bg === 'forest' && mood === 'anxious') comboParts.push('森林+焦虑——你的身体在替你做出选择：它知道绿色能安抚你，你正在本能地给自己开一剂"自然处方"');
  else if (mood === 'sad' && decos.length >= 3) comboParts.push('低落+很多装饰——你正在用物件给自己"取暖"，这份自我照护的直觉很珍贵');
  else if (mood === 'warm' && bg === 'sunset') comboParts.push('温暖+日落——你在有意识地为自己调取温度，内心正在主动进行情绪修复');
  const comboStr = comboParts.length ? comboParts.join('；') : '你的每一个选择都在共同编织一份关于"此刻我需要什么"的答案';

  return `<p style="font-weight:600;color:var(--text);">一、你为什么这样搭——从选择看见内心</p>
  <p>你刚才做了一系列看似随意的选择：选了一个基底、一个背景、一个情绪标签，也许还加了一些装饰。但环境心理学告诉我们，这些选择从不随意——Proshansky等人（1983）的"地方认同"理论指出，人对空间的建构是内在心理状态的外化投射。你搭的不只是一间小屋，你搭的是"此刻你心里需要待在什么地方"。</p>
  <p style="font-weight:600;color:var(--text);margin-top:12px;">二、逐项拆解：每个选择在说什么</p>
  <p><strong>1. 你选了"${baseNames[base] || '经典小屋'}"——${base ? '你想被怎样保护' : ''}</strong><br>${baseInsights[base] || baseInsights.classic}</p>
  <p style="margin-top:8px;"><strong>2. 你选了"${bg ? (bg === 'sunset' ? '日落' : bg === 'night' ? '星空' : '森林') : '未选'}"做背景——${bg ? '你想看见什么样的世界' : ''}</strong><br>${bg ? bgInsights[bg] || '' : '你没有选背景——也许你此刻的关注点完全在"自己"身上，外部环境暂时不重要。这本身也是一种信号：你正在向内看。'}</p>
  <p style="margin-top:8px;"><strong>3. 你标了"${mood ? moodNames[mood] : '未选'}"——${mood ? '你此刻怎么看待自己' : ''}</strong><br>${mood ? moodInsights[mood] || '' : '你没标情绪。也许此刻的感受太复杂了，找不到一个准确的词——这很正常，不是所有感受都需要被命名，允许它保持模糊也是一种智慧。'}</p>
  <p style="margin-top:8px;"><strong>4. 装饰选择——你在给自己什么</strong><br>${decoInsight}</p>
  <p style="margin-top:8px;"><strong>5. DIY小人形象</strong><br>你为小人选了"${diy.skin || 'light'}"肤色、"${diy.outfit || 'casual'}"穿搭、"${diy.acces || 'hat'}"配饰。Rogers（1959）的自我概念理论指出，虚拟形象是"理想自我"或"当下自我"的投射——你选的穿搭风格映射了你此刻想以什么姿态存在，配饰则可能补偿了现实中没被满足的表达欲。这个小人就是此刻的你。</p>
  <p style="font-weight:600;color:var(--text);margin-top:12px;">三、综合洞察</p>
  <p>把你的所有选择放在一起看：${comboStr}。Scannell & Gifford（2010）的"地方依恋"理论认为，人与空间之间的情感纽带是双向的——你塑造了这间小屋，它也在此刻塑造着你。它接住了你来不及说出口的一切。</p>${ref}`;
}

function completeHouse() {
  const { base, mood, decos } = STATE.houseState;
  const resultDiv = document.getElementById('house-result');

  // 个性化温馨安慰话语
  const comfort = getHouseComfortMessage();

  resultDiv.classList.remove('hidden');
  resultDiv.innerHTML = `
    <div class="sticker-result">
      <div class="resonance-box">
        <div class="resonance-text">${comfort}</div>
      </div>

      <div class="collapse-wrap">
        <div class="collapse-trigger" onclick="toggleCollapse('house-interpret')">
          <span class="arrow">▸</span> 环境投射解读（APA7）
        </div>
        <div class="collapse-content" id="house-interpret">
          ${buildHouseInterpretation()}
        </div>
      </div>

      <div style="margin-top: 16px; padding: 20px; background: #fce8ea; border-radius: 16px;">
        <div style="font-size: 48px; margin-bottom: 8px;">🏡</div>
        <div style="font-size: 16px; font-weight: 600; color: var(--text);">${mood ? '情绪小屋·' + ({calm:'平静',happy:'愉悦',sad:'低落',anxious:'焦虑',warm:'温暖'})[mood] || '' : '情绪小屋'}贴纸</div>
        <div style="font-size: 13px; color: var(--text-light); margin-top: 4px;">已存入「我的情绪旅程」</div>
      </div>
      <div class="btn-center-row mt-16">
        <button class="btn-primary" onclick="addStickerAndBack('🏡', '${mood ? '情绪小屋·' + ({calm:'平静',happy:'愉悦',sad:'低落',anxious:'焦虑',warm:'温暖'})[mood] || '' : '情绪小屋'}', '${mood || 'calm'}')">💾 保存贴纸并返回</button>
      </div>
    </div>
  `;
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
