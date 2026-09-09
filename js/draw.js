// 绘画投射图片池（SVG复杂抽象画，每幅都能触发不同情绪投射）
const DRAW_IMAGES = [
  // 图1: 漂浮的岛屿与流动的云 - 触发孤独/自由/渴望投射
  `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#e8eef4"/>
        <stop offset="60%" stop-color="#d9e5df"/>
        <stop offset="100%" stop-color="#c8d8d0"/>
      </linearGradient>
      <radialGradient id="sun1" cx="0.5" cy="0.5">
        <stop offset="0%" stop-color="#f5e0c8" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#f5e0c8" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="200" height="200" fill="url(#sky1)"/>
    <circle cx="150" cy="50" r="35" fill="url(#sun1)"/>
    <circle cx="150" cy="50" r="12" fill="#f0c8a8" opacity="0.6"/>
    <!-- 远处流动的云 -->
    <ellipse cx="50" cy="40" rx="25" ry="8" fill="#fff" opacity="0.5"/>
    <ellipse cx="60" cy="42" rx="18" ry="6" fill="#fff" opacity="0.4"/>
    <ellipse cx="110" cy="55" rx="20" ry="6" fill="#fff" opacity="0.3"/>
    <!-- 漂浮岛屿1 -->
    <ellipse cx="60" cy="100" rx="35" ry="12" fill="#a8c9b8" opacity="0.6"/>
    <path d="M30 100 Q60 120 90 100 L85 110 Q60 125 35 110 Z" fill="#8ab098" opacity="0.5"/>
    <line x1="45" y1="95" x2="42" y2="80" stroke="#7a9088" stroke-width="1"/>
    <circle cx="42" cy="78" r="4" fill="#e8b4b8" opacity="0.6"/>
    <line x1="70" y1="95" x2="73" y2="85" stroke="#7a9088" stroke-width="1"/>
    <circle cx="73" cy="83" r="3" fill="#c4b5d4" opacity="0.6"/>
    <!-- 漂浮岛屿2 -->
    <ellipse cx="140" cy="130" rx="40" ry="14" fill="#b8d4c8" opacity="0.6"/>
    <path d="M105 130 Q140 152 175 130 L170 142 Q140 157 110 142 Z" fill="#98b8a8" opacity="0.5"/>
    <path d="M125 125 Q135 115 145 125" stroke="#8a9088" stroke-width="1.5" fill="none"/>
    <circle cx="155" cy="122" r="5" fill="#f0c8b8" opacity="0.5"/>
    <!-- 连接的细线 - 蛛丝般的联系 -->
    <path d="M90 105 Q115 118 105 128" stroke="#c4a8a0" stroke-width="0.8" fill="none" opacity="0.4" stroke-dasharray="2,3"/>
    <!-- 底部水波 -->
    <path d="M0 175 Q25 170 50 175 T100 175 T150 175 T200 175" stroke="#b5cce0" stroke-width="1.5" fill="none" opacity="0.4"/>
    <path d="M0 185 Q30 180 60 185 T120 185 T200 185" stroke="#b5cce0" stroke-width="1" fill="none" opacity="0.3"/>
    <!-- 小鸟剪影 -->
    <path d="M30 60 Q35 57 40 60 Q45 57 50 60" stroke="#8a7a74" stroke-width="1" fill="none" opacity="0.4"/>
    <path d="M160 70 Q163 68 166 70 Q169 68 172 70" stroke="#8a7a74" stroke-width="0.8" fill="none" opacity="0.3"/>
  </svg>`,
  // 图2: 缠绕的根系与发光的种子 - 触发生长/束缚/希望投射
  `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="glow2" cx="0.5" cy="0.5">
        <stop offset="0%" stop-color="#f5e0a8" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#f5e0a8" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f0e8e0"/>
        <stop offset="100%" stop-color="#e0d0c4"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#bg2)"/>
    <!-- 中心发光种子 -->
    <circle cx="100" cy="100" r="30" fill="url(#glow2)"/>
    <ellipse cx="100" cy="100" rx="8" ry="12" fill="#e8c878" opacity="0.7"/>
    <ellipse cx="100" cy="98" rx="4" ry="6" fill="#f5e8b0" opacity="0.8"/>
    <!-- 缠绕根系 - 上方 -->
    <path d="M100 88 Q90 70 75 65 Q60 60 50 45" stroke="#a08868" stroke-width="2" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M100 88 Q110 72 125 68 Q140 65 155 50" stroke="#a08868" stroke-width="2" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M100 88 Q95 75 85 80" stroke="#8a7058" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M100 88 Q108 76 118 82" stroke="#8a7058" stroke-width="1.5" fill="none" opacity="0.5"/>
    <!-- 缠绕根系 - 下方 -->
    <path d="M100 112 Q85 130 70 140 Q55 150 45 165" stroke="#a08868" stroke-width="2" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M100 112 Q115 130 130 142 Q145 152 160 165" stroke="#a08868" stroke-width="2" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M100 112 Q95 128 88 135" stroke="#8a7058" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M100 112 Q108 125 115 132" stroke="#8a7058" stroke-width="1.5" fill="none" opacity="0.5"/>
    <!-- 小结节 -->
    <circle cx="75" cy="65" r="3" fill="#c4a888" opacity="0.6"/>
    <circle cx="125" cy="68" r="3" fill="#c4a888" opacity="0.6"/>
    <circle cx="70" cy="140" r="3" fill="#c4a888" opacity="0.6"/>
    <circle cx="130" cy="142" r="3" fill="#c4a888" opacity="0.6"/>
    <!-- 散落的小点 - 种子/光点 -->
    <circle cx="40" cy="40" r="2" fill="#e8b4b8" opacity="0.5"/>
    <circle cx="165" cy="45" r="2" fill="#c4b5d4" opacity="0.5"/>
    <circle cx="35" cy="160" r="2" fill="#a8c9b8" opacity="0.5"/>
    <circle cx="170" cy="155" r="2" fill="#f0c8b8" opacity="0.5"/>
    <circle cx="20" cy="100" r="1.5" fill="#e8b4b8" opacity="0.4"/>
    <circle cx="180" cy="100" r="1.5" fill="#b5cce0" opacity="0.4"/>
    <!-- 顶部嫩芽 -->
    <path d="M100 88 L100 65" stroke="#7a9088" stroke-width="2" stroke-linecap="round"/>
    <path d="M100 70 Q92 65 90 58" stroke="#a8c9b8" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M100 75 Q108 70 110 63" stroke="#a8c9b8" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="90" cy="56" rx="4" ry="6" fill="#a8c9b8" opacity="0.7" transform="rotate(-30 90 56)"/>
    <ellipse cx="110" cy="61" rx="4" ry="6" fill="#a8c9b8" opacity="0.7" transform="rotate(30 110 61)"/>
  </svg>`,
  // 图3: 深海中的窗户与气泡 - 触发压抑/向往/探索投射
  `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="deep3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#b5cce0"/>
        <stop offset="50%" stop-color="#7a98b8"/>
        <stop offset="100%" stop-color="#4a6890"/>
      </linearGradient>
      <radialGradient id="window3" cx="0.5" cy="0.5">
        <stop offset="0%" stop-color="#f5e8c8"/>
        <stop offset="70%" stop-color="#f0d098"/>
        <stop offset="100%" stop-color="#d8a868"/>
      </radialGradient>
    </defs>
    <rect width="200" height="200" fill="url(#deep3)"/>
    <!-- 光线穿透 -->
    <path d="M60 0 L40 80" stroke="#e8f0f8" stroke-width="3" opacity="0.15"/>
    <path d="M100 0 L90 60" stroke="#e8f0f8" stroke-width="4" opacity="0.1"/>
    <path d="M150 0 L160 70" stroke="#e8f0f8" stroke-width="2" opacity="0.12"/>
    <!-- 海草 -->
    <path d="M20 200 Q25 170 20 140 Q15 110 25 80" stroke="#5a8070" stroke-width="2" fill="none" opacity="0.5"/>
    <path d="M180 200 Q175 165 185 130 Q190 100 180 75" stroke="#5a8070" stroke-width="2" fill="none" opacity="0.5"/>
    <path d="M30 200 Q35 175 28 150" stroke="#4a7060" stroke-width="1.5" fill="none" opacity="0.4"/>
    <!-- 中心的窗户/门 -->
    <rect x="75" y="70" width="50" height="70" rx="6" fill="url(#window3)" opacity="0.85"/>
    <rect x="75" y="70" width="50" height="70" rx="6" fill="none" stroke="#8a6840" stroke-width="2.5"/>
    <!-- 窗户十字格 -->
    <line x1="100" y1="70" x2="100" y2="140" stroke="#8a6840" stroke-width="1.5"/>
    <line x1="75" y1="105" x2="125" y2="105" stroke="#8a6840" stroke-width="1.5"/>
    <!-- 窗内的剪影 -->
    <ellipse cx="100" cy="95" rx="8" ry="10" fill="#8a6840" opacity="0.4"/>
    <path d="M92 105 Q100 115 108 105" stroke="#8a6840" stroke-width="1.5" fill="none" opacity="0.4"/>
    <!-- 气泡群 -->
    <circle cx="50" cy="100" r="6" fill="none" stroke="#e8f0f8" stroke-width="1" opacity="0.5"/>
    <circle cx="48" cy="95" r="2" fill="#e8f0f8" opacity="0.3"/>
    <circle cx="155" cy="90" r="8" fill="none" stroke="#e8f0f8" stroke-width="1" opacity="0.5"/>
    <circle cx="152" cy="85" r="2.5" fill="#e8f0f8" opacity="0.3"/>
    <circle cx="60" cy="60" r="4" fill="none" stroke="#e8f0f8" stroke-width="0.8" opacity="0.4"/>
    <circle cx="145" cy="140" r="5" fill="none" stroke="#e8f0f8" stroke-width="0.8" opacity="0.4"/>
    <circle cx="140" cy="160" r="3" fill="none" stroke="#e8f0f8" stroke-width="0.8" opacity="0.3"/>
    <circle cx="40" cy="140" r="3" fill="none" stroke="#e8f0f8" stroke-width="0.8" opacity="0.3"/>
    <!-- 底部海床 -->
    <path d="M0 195 Q50 185 100 192 Q150 198 200 190 L200 200 L0 200 Z" fill="#3a5878" opacity="0.6"/>
    <ellipse cx="40" cy="192" rx="6" ry="2" fill="#2a4868" opacity="0.5"/>
    <ellipse cx="160" cy="190" rx="8" ry="2" fill="#2a4868" opacity="0.5"/>
    <!-- 远处鱼影 -->
    <path d="M130 50 Q135 47 140 50 L138 53 L132 53 Z" fill="#3a5878" opacity="0.3"/>
    <path d="M65 155 Q68 153 71 155 L70 157 L66 157 Z" fill="#3a5878" opacity="0.3"/>
  </svg>`,
  // 图4: 迷宫与中心的光 - 触发困惑/寻找/方向投射
  `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="center4" cx="0.5" cy="0.5">
        <stop offset="0%" stop-color="#fff5d8"/>
        <stop offset="50%" stop-color="#f5d8a0" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#f5d8a0" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="200" height="200" fill="#ede8e4"/>
    <!-- 中心光晕 -->
    <circle cx="100" cy="100" r="45" fill="url(#center4)"/>
    <!-- 迷宫路径 -->
    <path d="M30 30 L170 30 L170 80 L130 80 L130 50 L70 50 L70 90 L100 90" stroke="#a89888" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M100 90 L100 130 L60 130 L60 100" stroke="#a89888" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M170 80 L170 130 L140 130 L140 110" stroke="#a89888" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M30 30 L30 100 L50 100" stroke="#a89888" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M60 100 L60 170 L110 170 L110 150" stroke="#a89888" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M110 150 L150 150 L150 170 L180 170" stroke="#a89888" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M30 100 L30 170 L60 170" stroke="#a89888" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>
    <!-- 中心目标 -->
    <circle cx="100" cy="100" r="8" fill="#f5c878" opacity="0.8"/>
    <circle cx="100" cy="100" r="4" fill="#fff5d8"/>
    <!-- 散落的标记点 -->
    <circle cx="70" cy="50" r="3" fill="#e8b4b8" opacity="0.6"/>
    <circle cx="130" cy="50" r="3" fill="#c4b5d4" opacity="0.6"/>
    <circle cx="50" cy="100" r="3" fill="#a8c9b8" opacity="0.6"/>
    <circle cx="140" cy="110" r="3" fill="#b5cce0" opacity="0.6"/>
    <circle cx="60" cy="130" r="3" fill="#f0c8b8" opacity="0.6"/>
    <circle cx="110" cy="150" r="3" fill="#e8b4b8" opacity="0.6"/>
    <!-- 指引箭头（虚线） -->
    <path d="M45 45 L60 48" stroke="#c4a8a0" stroke-width="1" fill="none" opacity="0.4" stroke-dasharray="2,2"/>
    <path d="M155 55 L140 60" stroke="#c4a8a0" stroke-width="1" fill="none" opacity="0.4" stroke-dasharray="2,2"/>
    <path d="M45 155 L55 140" stroke="#c4a8a0" stroke-width="1" fill="none" opacity="0.4" stroke-dasharray="2,2"/>
    <!-- 入口标记 -->
    <text x="30" y="25" font-size="8" fill="#8a7a74" opacity="0.5">?</text>
    <text x="168" y="25" font-size="8" fill="#8a7a74" opacity="0.5">?</text>
  </svg>`,
  // 图5: 树影下的人物剪影与落花 - 触发孤独/宁静/回忆投射
  `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dusk5" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f5d8c8"/>
        <stop offset="50%" stop-color="#e8b4b8"/>
        <stop offset="100%" stop-color="#c4a0a8"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#dusk5)"/>
    <!-- 远山 -->
    <path d="M0 130 L40 100 L80 120 L120 90 L160 110 L200 95 L200 140 L0 140 Z" fill="#a08898" opacity="0.4"/>
    <path d="M0 140 L50 120 L100 130 L150 115 L200 125 L200 150 L0 150 Z" fill="#8a7088" opacity="0.5"/>
    <!-- 大树 -->
    <ellipse cx="145" cy="80" rx="35" ry="30" fill="#6a5868" opacity="0.6"/>
    <ellipse cx="130" cy="70" rx="22" ry="20" fill="#7a6880" opacity="0.5"/>
    <ellipse cx="160" cy="75" rx="20" ry="18" fill="#7a6880" opacity="0.5"/>
    <path d="M145 110 L142 150 L148 150 L145 110 Z" fill="#5a4858" opacity="0.7"/>
    <!-- 树枝 -->
    <path d="M145 90 Q125 85 115 75" stroke="#5a4858" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M145 85 Q165 80 175 70" stroke="#5a4858" stroke-width="2" fill="none" opacity="0.6"/>
    <!-- 人物剪影 - 坐姿 -->
    <ellipse cx="60" cy="130" rx="8" ry="6" fill="#4a3848" opacity="0.8"/>
    <path d="M52 135 L68 135 L72 155 L48 155 Z" fill="#4a3848" opacity="0.8"/>
    <circle cx="60" cy="125" r="5" fill="#4a3848" opacity="0.8"/>
    <!-- 膝盖 -->
    <ellipse cx="55" cy="150" rx="4" ry="3" fill="#4a3848" opacity="0.8"/>
    <!-- 飘落的花瓣 -->
    <ellipse cx="100" cy="40" rx="3" ry="5" fill="#fce8ea" opacity="0.8" transform="rotate(30 100 40)"/>
    <ellipse cx="85" cy="60" rx="2.5" ry="4" fill="#fce8ea" opacity="0.7" transform="rotate(-20 85 60)"/>
    <ellipse cx="110" cy="75" rx="2" ry="3" fill="#f5d0d8" opacity="0.6" transform="rotate(45 110 75)"/>
    <ellipse cx="70" cy="90" rx="2.5" ry="4" fill="#fce8ea" opacity="0.5" transform="rotate(-30 70 90)"/>
    <ellipse cx="50" cy="105" rx="2" ry="3" fill="#f5d0d8" opacity="0.5" transform="rotate(60 50 105)"/>
    <ellipse cx="125" cy="95" rx="2" ry="3" fill="#fce8ea" opacity="0.4" transform="rotate(-15 125 95)"/>
    <ellipse cx="35" cy="115" rx="1.5" ry="2.5" fill="#f5d0d8" opacity="0.4"/>
    <!-- 地面 -->
    <path d="M0 155 L200 155 L200 200 L0 200 Z" fill="#8a6a78" opacity="0.4"/>
    <path d="M0 160 Q50 158 100 162 Q150 165 200 160" stroke="#7a5a68" stroke-width="1" fill="none" opacity="0.5"/>
    <!-- 草 -->
    <line x1="20" y1="155" x2="20" y2="148" stroke="#6a5868" stroke-width="1" opacity="0.5"/>
    <line x1="25" y1="156" x2="26" y2="150" stroke="#6a5868" stroke-width="1" opacity="0.5"/>
    <line x1="90" y1="156" x2="90" y2="149" stroke="#6a5868" stroke-width="1" opacity="0.5"/>
    <line x1="180" y1="155" x2="180" y2="150" stroke="#6a5868" stroke-width="1" opacity="0.5"/>
    <line x1="185" y1="156" x2="186" y2="151" stroke="#6a5868" stroke-width="1" opacity="0.5"/>
    <!-- 远处的光点 -->
    <circle cx="30" cy="50" r="1.5" fill="#fff" opacity="0.6"/>
    <circle cx="170" cy="40" r="1" fill="#fff" opacity="0.5"/>
  </svg>`,
  // 图6: 悬浮的门与阶梯 - 触发选择/转变/未知投射
  `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mist6" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#e8e0ec"/>
        <stop offset="100%" stop-color="#c8c0d4"/>
      </linearGradient>
      <linearGradient id="door6" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f5e8c8"/>
        <stop offset="100%" stop-color="#e8c898"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#mist6)"/>
    <!-- 雾气云团 -->
    <ellipse cx="50" cy="50" rx="35" ry="12" fill="#fff" opacity="0.4"/>
    <ellipse cx="150" cy="45" rx="30" ry="10" fill="#fff" opacity="0.3"/>
    <ellipse cx="100" cy="170" rx="50" ry="15" fill="#fff" opacity="0.3"/>
    <!-- 悬浮的阶梯（断裂） -->
    <rect x="20" y="160" width="30" height="6" rx="1" fill="#a89888" opacity="0.6"/>
    <rect x="55" y="145" width="28" height="6" rx="1" fill="#a89888" opacity="0.6"/>
    <rect x="85" y="130" width="26" height="6" rx="1" fill="#a89888" opacity="0.5"/>
    <!-- 断裂间隙 -->
    <rect x="130" y="105" width="24" height="6" rx="1" fill="#a89888" opacity="0.5"/>
    <!-- 悬浮的门 -->
    <rect x="125" y="60" width="40" height="60" rx="4" fill="url(#door6)" opacity="0.85"/>
    <rect x="125" y="60" width="40" height="60" rx="4" fill="none" stroke="#8a6840" stroke-width="2"/>
    <!-- 门把手 -->
    <circle cx="158" cy="92" r="2" fill="#8a6840"/>
    <!-- 门框装饰 -->
    <path d="M125 60 Q145 55 165 60" stroke="#8a6840" stroke-width="1.5" fill="none"/>
    <!-- 门内的光 -->
    <rect x="130" y="65" width="30" height="50" rx="2" fill="#fff5d8" opacity="0.5"/>
    <!-- 门后透出的光线 -->
    <path d="M145 120 L120 160" stroke="#fff5d8" stroke-width="3" opacity="0.3"/>
    <path d="M145 120 L170 160" stroke="#fff5d8" stroke-width="2" opacity="0.2"/>
    <!-- 其他悬浮的门（远处小） -->
    <rect x="30" y="80" width="20" height="30" rx="2" fill="#d8c8b0" opacity="0.4"/>
    <rect x="30" y="80" width="20" height="30" rx="2" fill="none" stroke="#a08868" stroke-width="1" opacity="0.4"/>
    <rect x="75" y="70" width="16" height="24" rx="2" fill="#d8c8b0" opacity="0.3"/>
    <!-- 飘落的羽毛/叶子 -->
    <path d="M40 100 Q42 105 40 110 Q38 105 40 100" fill="#c4b5d4" opacity="0.4"/>
    <path d="M180 90 Q182 95 180 100 Q178 95 180 90" fill="#e8b4b8" opacity="0.4"/>
    <path d="M60 120 Q62 125 60 130 Q58 125 60 120" fill="#a8c9b8" opacity="0.3"/>
    <!-- 星点 -->
    <circle cx="100" cy="30" r="1.5" fill="#fff" opacity="0.6"/>
    <circle cx="40" cy="25" r="1" fill="#fff" opacity="0.5"/>
    <circle cx="170" cy="30" r="1.5" fill="#fff" opacity="0.5"/>
    <circle cx="90" cy="50" r="1" fill="#fff" opacity="0.4"/>
  </svg>`,
  // 图7: 镜面湖与倒影 - 触发自我/反思/双重投射
  `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky7" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#d8e0e8"/>
        <stop offset="100%" stop-color="#b8c8d8"/>
      </linearGradient>
      <linearGradient id="water7" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#98b0c8"/>
        <stop offset="100%" stop-color="#6888a8"/>
      </linearGradient>
    </defs>
    <!-- 天空 -->
    <rect width="200" height="100" fill="url(#sky7)"/>
    <!-- 水面 -->
    <rect y="100" width="200" height="100" fill="url(#water7)"/>
    <!-- 山（实景） -->
    <path d="M0 100 L50 50 L90 80 L130 40 L180 75 L200 60 L200 100 Z" fill="#7a8898" opacity="0.7"/>
    <path d="M0 100 L40 70 L80 85 L120 60 L160 80 L200 70 L200 100 Z" fill="#8a98a8" opacity="0.5"/>
    <!-- 山倒影（翻转+模糊） -->
    <path d="M0 100 L50 150 L90 120 L130 160 L180 125 L200 140 L200 100 Z" fill="#7a8898" opacity="0.3" transform="scale(1,-1) translate(0,-200)"/>
    <!-- 太阳/月亮 -->
    <circle cx="150" cy="40" r="15" fill="#f5e8c8" opacity="0.8"/>
    <circle cx="150" cy="40" r="15" fill="none" stroke="#e8d098" stroke-width="1" opacity="0.5"/>
    <!-- 倒影 -->
    <ellipse cx="150" cy="160" rx="15" ry="3" fill="#f5e8c8" opacity="0.3"/>
    <!-- 水面波纹 -->
    <path d="M0 105 Q25 103 50 105 T100 105 T150 105 T200 105" stroke="#b8d0e0" stroke-width="0.8" fill="none" opacity="0.5"/>
    <path d="M0 115 Q30 113 60 115 T120 115 T200 115" stroke="#b8d0e0" stroke-width="0.8" fill="none" opacity="0.4"/>
    <path d="M0 130 Q40 128 80 130 T160 130 T200 130" stroke="#a8c0d8" stroke-width="0.6" fill="none" opacity="0.3"/>
    <path d="M0 150 Q50 148 100 150 T200 150" stroke="#a8c0d8" stroke-width="0.6" fill="none" opacity="0.3"/>
    <!-- 小船 + 倒影 -->
    <path d="M70 100 L80 100 L78 95 L72 95 Z" fill="#5a4838" opacity="0.7"/>
    <line x1="75" y1="95" x2="75" y2="85" stroke="#5a4838" stroke-width="1"/>
    <path d="M75 85 L80 90 L75 90 Z" fill="#e8d5cf" opacity="0.6"/>
    <path d="M70 100 L80 100 L78 105 L72 105 Z" fill="#5a4838" opacity="0.2"/>
    <!-- 飞鸟 -->
    <path d="M30 35 Q35 32 40 35 Q45 32 50 35" stroke="#5a4838" stroke-width="1.2" fill="none" opacity="0.6"/>
    <path d="M100 25 Q103 23 106 25 Q109 23 112 25" stroke="#5a4838" stroke-width="1" fill="none" opacity="0.5"/>
    <!-- 倒影飞鸟 -->
    <path d="M30 165 Q35 168 40 165 Q45 168 50 165" stroke="#5a4838" stroke-width="1" fill="none" opacity="0.25"/>
    <!-- 水中涟漪 -->
    <ellipse cx="75" cy="110" rx="8" ry="1.5" fill="none" stroke="#d8e8f0" stroke-width="0.6" opacity="0.5"/>
    <ellipse cx="75" cy="115" rx="12" ry="2" fill="none" stroke="#d8e8f0" stroke-width="0.5" opacity="0.3"/>
    <!-- 岸边草 -->
    <line x1="5" y1="100" x2="5" y2="95" stroke="#6a8078" stroke-width="1.5" opacity="0.6"/>
    <line x1="10" y1="100" x2="11" y2="93" stroke="#6a8078" stroke-width="1.5" opacity="0.6"/>
    <line x1="190" y1="100" x2="190" y2="96" stroke="#6a8078" stroke-width="1.5" opacity="0.6"/>
    <line x1="195" y1="100" x2="196" y2="94" stroke="#6a8078" stroke-width="1.5" opacity="0.6"/>
  </svg>`
];

// =============================================================
// 模块2: 绘画投射
// =============================================================
function startDraw() {
  SoundFX.drawStart();
  document.getElementById('draw-start').classList.add('hidden');
  document.getElementById('draw-content').classList.remove('hidden');

  const idx = Math.floor(Math.random() * DRAW_IMAGES.length);
  STATE.drawState.imageIdx = idx;
  STATE.drawState.q1 = '';
  STATE.drawState.q2 = '';
  STATE.drawState.q3 = '';
  STATE.drawState.done = false;

  document.getElementById('draw-image').innerHTML = DRAW_IMAGES[idx];
  document.getElementById('draw-q1').value = '';
  document.getElementById('draw-q2').value = '';
  document.getElementById('draw-q3').value = '';
  document.getElementById('draw-empathy-card').style.display = 'none';
  document.getElementById('draw-done-btn').disabled = true;
  document.getElementById('draw-result').classList.add('hidden');
}

function checkDrawDone() {
  const q1 = document.getElementById('draw-q1').value.trim();
  const q2 = document.getElementById('draw-q2').value.trim();
  const q3 = document.getElementById('draw-q3').value.trim();
  STATE.drawState.q1 = q1;
  STATE.drawState.q2 = q2;
  STATE.drawState.q3 = q3;

  if (q1 && q2 && q3) {
    document.getElementById('draw-done-btn').disabled = false;
    // 显示共情反馈
    const empathy = generateEmpathy(q1, q2, q3);
    document.getElementById('draw-empathy-card').style.display = 'block';
    document.getElementById('draw-empathy-text').textContent = empathy;
  } else {
    document.getElementById('draw-done-btn').disabled = true;
  }
}

function generateEmpathy(q1, q2, q3) {
  // 基于实际情绪关键词的共情反馈
  const sadKw = ['悲伤','难过','伤心','孤独','寂寞','失落','忧郁','哀伤','泪','哭'];
  const anxiousKw = ['焦虑','不安','紧张','害怕','恐惧','担心','慌','烦躁','压抑','窒息'];
  const hopefulKw = ['希望','期待','光明','未来','美好','向往','梦想','光','勇气'];
  const warmKw = ['温暖','温馨','温柔','感动','柔软','治愈','幸福','快乐','爱','拥抱'];
  const lonelyKw = ['孤独','寂寞','一个人','冷清','空旷','渺小','无人','漂泊'];

  const allText = q1 + ' ' + q2 + ' ' + q3;
  if (sadKw.some(kw => allText.includes(kw))) {
    return `看起来你好像有点悲伤。不过，你愿意把这份感受写下来，就已经在让它流动了——悲伤不需要被赶走，它只是想被你看见。`;
  }
  if (anxiousKw.some(kw => allText.includes(kw))) {
    return `看起来你好像有些不安。不过，当焦虑被你说出来、写下来，它就从一团雾变成了可以被看见的东西——这本身就是一种释放。`;
  }
  if (lonelyKw.some(kw => allText.includes(kw))) {
    return `看起来你好像有点孤单。不过，你在这幅画里找到了属于自己的故事——能和自己独处并看见自己，这本身就是一种力量。`;
  }
  if (hopefulKw.some(kw => allText.includes(kw))) {
    return `看起来你心里有光。你在模糊的画面里看见了希望——这种"在不确定中依然能找到方向"的能力，是你很珍贵的东西。`;
  }
  if (warmKw.some(kw => allText.includes(kw))) {
    return `看起来你此刻心里是暖的。你在画中感受到的温度，正是你内心在主动为自己寻找的滋养——这份柔软会陪着你。`;
  }
  return `你在这幅画里看到了属于自己的故事——那些形状和颜色，仿佛在替你说话。谢谢你愿意分享这些真实的感受。`;
}

// ====== 绘画投射：基于用户实际回答的动态心理分析 ======
function buildDrawInterpretation() {
  const { q1, q2, q3 } = STATE.drawState;
  const ref = `<p style="margin-top: 10px; font-size: 12px; color: var(--text-muted);">
    <strong>参考文献</strong><br>
    Bruner, J. S. (1990). <em>Acts of meaning</em>. Harvard University Press.<br>
    Frank, L. K. (1939). Projective methods for the study of personality. <em>Journal of Psychology</em>, 8(2), 389–413.<br>
    Gallese, V. (2005). Embodied simulation. <em>Phenomenology and the Cognitive Sciences</em>, 4(1), 23–48.<br>
    Kramer, E. (1971). <em>Art as therapy with children</em>. Schocken Books.<br>
    Lakoff, G., & Johnson, M. (1999). <em>Philosophy in the flesh</em>. Basic Books.<br>
    Lomas, H. (1976). <em>Treatment for the creative artist</em>. Routledge & Kegan Paul.<br>
    McAdams, D. P. (2013). The psychological self as actor, agent, and author. <em>Perspectives on Psychological Science</em>, 8(3), 272–295.<br>
    Murray, H. A. (1943). <em>Thematic Apperception Test manual</em>. Harvard University Press.
  </p>`;

  // 情绪关键词分析 q2
  const emotionKeywords = {
    calm: ['平静', '安静', '宁静', '平和', '放松', '安详', '祥和', '舒服', '轻松', '自在', '宁静', '安宁', '淡然'],
    sad: ['悲伤', '难过', '伤心', '孤独', '寂寞', '失落', '忧郁', '沉痛', '哀伤', '遗憾', '叹', '泪', '哭泣', '难受'],
    anxious: ['焦虑', '不安', '紧张', '害怕', '恐惧', '担心', '慌张', '烦躁', '慌乱', '压抑', '沉重', '窒息'],
    hopeful: ['希望', '期待', '憧憬', '光明', '未来', '美好', '向往', '梦想', '渴望', '盼', '光', '启发', '勇气'],
    warm: ['温暖', '温馨', '温柔', '感动', '柔软', '治愈', '幸福', '快乐', '开心', '欢喜', '甜蜜', '爱', '拥抱', '陪伴'],
    lonely: ['孤独', '寂寞', '单独', '冷清', '空旷', '渺小', '一个人', '无人', '远离', '漂泊'],
    curious: ['好奇', '探索', '神秘', '未知', '发现', '奇妙', '有趣', '想象', '幻想', '超现实', '抽象'],
    nostalgic: ['回忆', '怀念', '过去', '童年', '以前', '曾经', '旧', '思念', '想起', '记得']
  };
  let detectedEmotions = [];
  let bestEmotion = 'calm';
  let bestScore = 0;
  Object.entries(emotionKeywords).forEach(([cat, keywords]) => {
    let score = 0;
    keywords.forEach(kw => {
      if (q2.includes(kw)) score++;
      if (q1.includes(kw)) score += 0.5;
      if (q3.includes(kw)) score += 0.5;
    });
    if (score > 0) detectedEmotions.push({ cat, score });
    if (score > bestScore) { bestScore = score; bestEmotion = cat; }
  });
  if (detectedEmotions.length === 0) detectedEmotions = [{ cat: 'complex', score: 0 }];

  const emotionNames = { calm: '平静/安宁', sad: '悲伤/忧郁', anxious: '焦虑/压抑', hopeful: '希望/憧憬', warm: '温暖/感动', lonely: '孤独/疏离', curious: '好奇/探索', nostalgic: '怀念/回忆', complex: '复杂多元' };
  const emotionTheories = {
    calm: `你在画中感受到的是"平静"。但记住——画本身没有情绪，是"你"把平静投射到了上面。Frank（1939）的投射假设说明：你之所以看到平静，是因为你此刻内心有一块地方是安宁的，或者你正在强烈地渴望安宁。如果是前者，说明你的心理资源目前是充足的；如果是后者，说明你正在从这幅画里"借"一份你还需要确认的宁静。`,
    sad: `你在画中看到了"悲伤"。这其实不是画在悲伤——是你心里的悲伤找到了一个出口。Frank（1939）指出，模糊的画面就像一面镜子，它会映出你内心最活跃的那个情绪。悲伤浮上来了，说明它想被你看见。也许在日常生活中你一直在压着它，而在这幅画的安全距离里，它终于被允许出来了。`,
    anxious: `你在画中感受到了"焦虑/不安"。焦虑最折磨人的地方是它没有形状——但在这一刻，你把它"放"进了这幅画里，它就有了轮廓。Gallese（2005）的具身模拟理论指出，当你用语言描述画面中的不安时，你的身体其实在重新经历并处理它。你不是在"看画"，你是在给自己的焦虑找一个可以对话的对象。`,
    hopeful: `你在画中看到了"希望/光明"。Murray（1943）的TAT研究发现：能在模糊甚至暗淡的画面中看到希望的人，往往具有较高的心理韧性。但更深的解读是——你此刻内心有一个还没被满足的渴望，你在画里找到了它的影子。你看到的不是画里的光，而是你自己心里那盏还没灭的灯。`,
    warm: `你在画中感受到了"温暖"。温暖是一种"接近性"情绪——当你在模糊的画面中感受到温度，说明你此刻的心理系统正在主动寻找滋养。Lakoff & Johnson（1999）的概念隐喻理论指出，"温暖"是人类最原始的安全隐喻（母亲的体温=安全）。你在画里找的，也许不是温暖本身，而是那种"被好好对待"的感觉。`,
    lonely: `你在画中看到了"孤独"。需要区分：是你主动选择了独处（Solitude），还是你正承受着被孤立的痛苦（Loneliness）？如果是前者，说明你在画中找到了一个可以和自己安静待着的地方；如果是后者，这份孤独的投射其实是一个信号——你在渴望被看见、被理解。说出这份孤独，就已经是在向世界伸出手了。`,
    curious: `你面对这幅画时充满了"好奇"。这很珍贵。面对未知而不防御、面对模糊而不焦虑，需要心理上有足够的弹性。你此刻的状态是开放的——你不是在画面里找问题、找威胁，而是在找可能性。这说明你当前的内心有空间去容纳新东西，而不是被已有的压力塞满。`,
    nostalgic: `你的描述带着"怀念"的色彩。McAdams（2013）的叙事认同理论指出，回忆从来不是"回到过去"，而是"用过去解释现在"。你从这幅画里打捞起的记忆碎片，其实是你此刻心理主题的线索——也许你现在正面临一个选择，而那段回忆里藏着你已经知道、但还没说出口的答案。`,
    complex: `你的情绪感受很丰富，无法被单一标签概括。这不是"乱"，而是真实——人类的情绪本来就是混合的、流动的。能同时感受到多种情绪并容纳它们，是心理成熟的重要标志。你在画里看到的复杂性，正是你内心丰富度的映射。`
  };

  // 叙事风格分析 q3 —— 为什么用户这样讲故事
  let narrativeStyle;
  if (q3.length > 80) {
    narrativeStyle = `你的故事写得很长、很细。Bruner（1990）指出，叙事的丰富度与意义建构的深度正相关——你不是在"描述画"，你是在借这幅画"整理自己"。愿意花这么多笔墨去讲述，说明画中的某些东西触动了你，你正在通过书写来消化它。你的内心此刻可能正有一些需要被理清的东西，而画画给了你一个安全的入口。`;
  } else if (q3.length > 30) {
    narrativeStyle = `你的故事简洁但有力量。你用最少的字说出了最核心的东西——这种"精准"本身就是一种心理能力。McAdams（2013）指出，叙事的凝练往往意味着讲述者已经抓住了心理主题的本质，不需要多余的修饰。你此刻的内心是清醒的，你知道什么重要、什么不重要。`;
  } else {
    narrativeStyle = `你的故事极其简短。这种"留白"不是无话可说，而是"有些东西太重了，不需要太多字来承载"。Kramer（1971）所说的"第三只手"——有时候最深的感受恰恰无法被语言完全捕捉，留白本身就是一种表达。你此刻的内心可能有一些还没准备好展开的东西，这完全没关系。`;
  }

  // 内容分析 —— 用户在画里看到了什么，揭示了什么内心主题
  const contentWords = (q1 + ' ' + q3).toLowerCase();
  const hasNature = /自然|树|森林|花|海|山|天空|云|太阳|月亮|星星|水|河|湖|草|鸟|动物|风|雨|叶/.test(contentWords);
  const hasHuman = /人|自己|我|他|她|谁|孩子|老人|朋友|家|一个人|孤独/.test(contentWords);
  const hasJourney = /路|走|去|远|前行|旅行|方向|寻找|迷|漂泊|出发|离开|回|过/.test(contentWords);
  const hasConflict = /困|挣扎|黑暗|裂|碎|痛苦|伤|战斗|对抗|矛盾|冲突/.test(contentWords);
  const hasHope = /光|亮|希望|出口|新生|飞|升起|绽放|打开|解|突破/.test(contentWords);

  const contentInsights = [];
  if (hasNature) contentInsights.push('你在画中看到了自然意象——树木、天空、水或花。选择"自然"作为投射载体，往往意味着你此刻内心渴望一种"不被要求"的存在状态。自然不会评判你、不会给你布置任务，你也许正在从人造的压力环境里渴望逃离，哪怕只是精神上喘一口气。');
  if (hasHuman) contentInsights.push('你在描述中提到了人或关系。在模糊画面中"看到人"，往往映射着你此刻的人际心理状态——也许某段关系正在你心里发酵，也许你在渴望联结，又或者在处理一段关系带来的影响。画中人不是别人，是你心里那个正在与人打交道的自己。');
  if (hasJourney) contentInsights.push('你的叙事里有"路""走""远""方向"等旅程意象。旅程是心理过渡（Psychological Transition）最经典的隐喻——你此刻可能正站在人生的某个路口，或者在经历一种"还没到终点"的悬浮感。你不是在描述画里的路，你是在描述自己正在走的那条路。');
  if (hasConflict) contentInsights.push('你在画中看到了"挣扎""黑暗""碎裂"。当这些意象浮现，往往不是画面本身有问题，而是你内心有一些张力正在寻找出口。也许你正在面对某个两难、某种内在冲突，画面给了它一个可以"被看见"的形状——看见它，是化解它的第一步。');
  if (hasHope) contentInsights.push('你在画中看到了"光""出口""绽放"。在模糊的画面里找光，是一种珍贵的心理能力——Murray（1943）称之为"积极投射"。你此刻内心有一盏灯没灭，即使周围有些模糊或暗淡，你依然在本能地寻找出路。这不是盲目乐观，而是心理韧性的体现。');

  const contentStr = contentInsights.length ? contentInsights.map((s, i) => `${i+1}. ${s}`).join(' ') : '你的描述偏向抽象与直觉——你没有在画里看到具体的人或物，而是感受到了一种氛围。这种"直觉型投射"说明你此刻更依赖感受而非逻辑来理解世界，你的内心正在以一种非语言的方式运作。';

  let comboInsight = '';
  if (hasConflict && hasHope) comboInsight = '最值得注意的是：你的叙事里同时有"挣扎"和"光"。心理学上称为"救赎叙事"（Redemption Narrative）——在黑暗中依然能看到出口。这往往出现在正在经历困难但内心依然有力量的人身上。你不是在假装乐观，你是真的在痛，但也真的在找路。';
  else if (hasJourney && bestEmotion === 'anxious') comboInsight = '你看到了"路"但感到"焦虑"——这像是在说："我知道该往前走，但我不知道走对没有。"你此刻可能正处在某种不确定的过渡期，画里的路就是你心里的那条还没走完的路。';
  else if (bestEmotion === 'lonely' && hasNature) comboInsight = '孤独+自然——你也许在渴望一种"没有人的陪伴"：不是真的想孤立自己，而是想待在一个不需要表演、不需要回应的地方。这种需求很合理，给自己这个空间。';

  return `<p style="font-weight:600;color:var(--text);">一、你为什么这样看这幅画</p>
  <p>同一幅画，每个人看到的都不一样。Frank（1939）的投射性假设指出：模糊的画面就像一面镜子，你看到的不是画本身，而是你自己。Murray（1943）在TAT研究中验证了这个现象——你在这幅画里"看到什么""感受到什么""编出什么故事"，都不是随机的，而是你此刻内心状态的投射。换句话说，画没有情绪，是你的情绪找到了画。</p>
  <p style="font-weight:600;color:var(--text);margin-top:12px;">二、你的回答在说什么</p>
  <p><strong>1. 你感受到了"${emotionNames[bestEmotion] || '复杂多元'}"——这暴露了你此刻的内心基调</strong><br>${emotionTheories[bestEmotion] || emotionTheories.complex}</p>
  <p style="margin-top:8px;"><strong>2. 你这样讲故事——你的叙事方式本身就是信号</strong><br>${narrativeStyle}</p>
  <p style="margin-top:8px;"><strong>3. 你在画里看到了什么——每个意象都是内心主题的线索</strong><br>${contentStr}</p>
  ${comboInsight ? `<p style="margin-top:8px;"><strong>4. 特别注意</strong><br>${comboInsight}</p>` : ''}
  <p style="margin-top:8px;"><strong>${comboInsight ? '5' : '4'}. 你的完整回答</strong><br><span style="font-style:italic;color:var(--text-light);">"看到什么"：${escapeHtml(q1) || '——'}<br>"感受什么"：${escapeHtml(q2) || '——'}<br>"故事是什么"：${escapeHtml(q3) || '——'}</span></p>
  <p style="font-weight:600;color:var(--text);margin-top:12px;">三、温柔的提醒</p>
  <p>Kramer（1971）说艺术有一只"第三只手"——它在你和你的情绪之间保持着一个安全的距离，让你可以触碰深层感受而不被淹没。Lomas（1976）称这种距离为"创造性缓冲"。你刚才写下的每一个字，都是此刻你内心最真实的风景——不需要修改，不需要评判，它已经被看见了。</p>${ref}`;
}

function completeDraw() {
  STATE.drawState.done = true;
  SoundFX.complete();
  const resultDiv = document.getElementById('draw-result');
  resultDiv.classList.remove('hidden');

  // 个性化温馨安慰话语
  const comfort = generateEmpathy(STATE.drawState.q1, STATE.drawState.q2, STATE.drawState.q3);

  resultDiv.innerHTML = `
    <div class="sticker-result">
      <div class="resonance-box">
        <div class="resonance-text">${comfort}</div>
      </div>
      <div class="card" style="background:#ede8f4;margin-top:12px;">
        <div class="card-title">💬 你的感受</div>
        <p style="font-size:13px;color:var(--text-light);line-height:1.8;font-style:italic;">
          "${escapeHtml(STATE.drawState.q1.slice(0, 60))}…"
        </p>
      </div>
      <div class="collapse-wrap">
        <div class="collapse-trigger" onclick="toggleCollapse('draw-interpret-result')">
          <span class="arrow">▸</span> 艺术治疗专业解读（APA7）
        </div>
        <div class="collapse-content" id="draw-interpret-result">
          ${buildDrawInterpretation()}
        </div>
      </div>
      <div style="margin-top:16px;padding:20px;background:#ede8f4;border-radius:16px;">
        <div style="font-size:48px;margin-bottom:8px;">🎨</div>
        <div style="font-size:16px;font-weight:600;color:var(--text);">绘画投射·情绪贴纸</div>
        <div style="font-size:13px;color:var(--text-light);margin-top:4px;">每一幅画都是你内心的风景</div>
      </div>
      <div class="btn-center-row mt-16">
        <button class="btn-secondary" onclick="exitModule('page-draw')">← 退出</button>
        <button class="btn-primary" onclick="addStickerAndBack('🎨', '绘画投射', 'calm')">💾 保存贴纸并返回</button>
      </div>
    </div>
  `;
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
