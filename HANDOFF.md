# 心绪漫游小栈 — Codex 交接文档

## 1. 项目概述

**产品名**：心绪漫游小栈（Soul Journey Cabin）
**技术栈**：纯原生 HTML + CSS + JavaScript（无框架、无构建工具、无 npm 依赖）
**运行方式**：直接用浏览器打开 `index.html`，或用任意静态服务器（如 `python -m http.server`）
**存储方式**：使用多个 `localStorage` key。业务旅程与模块进度使用 `soul_journey`；登录演示、音效和 API 设置分别使用其他 key（详见“本地存储事实”）。
**项目本质**：一个情绪疗愈 Web 应用，用户通过 5 个情绪模块完成心理投射活动，收集"情绪贴纸"到"情绪旅程"中。

### 5 个业务模块

| 模块 | 页面 ID | 入口函数 | 结果函数 | 贴纸 emoji | 贴纸 label |
|------|---------|----------|----------|------------|------------|
| 极简小屋 | `page-house` | `selectHouseBase()` | `completeHouse()` | 🏡 | 情绪小屋·{mood} |
| 氛围小屋 | `page-atmosphere` | `switchAtmosTab()` | `completeAtmosphere()` / `showAtmosphereResult()` | 🌅 | 氛围小屋·情绪空间 |
| 绘画投射 | `page-draw` | `startDraw()` | `completeDraw()` | 🎨 | 绘画投射 |
| 放走坏心情 | `page-worry` | `submitWorry()` | `closeBottle()` | 🌊 | 释放·漂流瓶 |
| 此刻心意 | `page-choice` | `startChoice()` | `showChoiceResult()` | ☁️ | 云朵·情绪需求 |

### 页面结构（8 个页面）

```
page-login        登录页
page-home         首页（旅程列表 + 模块入口）
page-house-select 小屋选择页（极简 vs 氛围）
page-atmosphere   氛围小屋搭建页
page-house        极简小屋搭建页
page-draw         绘画投射页
page-worry        放走坏心情页
page-choice       此刻心意二选一页
```

---

## 2. 当前架构

### 文件结构

```
project-root/
├── index.html              (2779行) HTML结构 + 剩余内联JS (~1990行)
├── css/
│   ├── variables.css       CSS变量定义
│   ├── global.css          全局样式
│   ├── login.css           登录页
│   ├── home.css             首页+旅程列表
│   ├── common-components.css 通用组件(按钮/弹窗等)
│   ├── house.css           极简小屋
│   ├── atmosphere.css      氛围小屋
│   ├── draw.css            绘画投射
│   ├── worry.css           放走坏心情
│   ├── choice.css          此刻心意
│   └── responsive.css      响应式
├── js/
│   ├── state.js            全局STATE对象(14行)
│   ├── utils/
│   │   ├── xss.js          escapeHtml函数(16行)
│   │   └── validation.js   truncateUnicode函数(8行)
│   ├── storage.js          localStorage读写(39行)
│   ├── soundfx.js          音效系统(85行)
│   ├── navigation.js       页面导航+退出弹窗(59行)
│   ├── auth.js             GitHub/Google OAuth 演示、微信 postMessage、邮箱演示登录(211行)
│   ├── journey.js          旅程管理+贴纸(171行)
│   ├── worry.js            放走坏心情模块(225行)
│   ├── draw.js             绘画投射模块(534行)
│   └── (待拆分模块文件)
├── assets/
│   ├── audio/              14个 WAV 音效文件
│   ├── backgrounds/        背景图(8张)
│   ├── cabin-basics/       小屋基底(6张)
│   ├── furniture/          家具(13张)
│   ├── desk-items/         摆件(5张)
│   ├── character/          人物(4张)
│   └── outdoor-decor/      户外装饰(6张)
└── .gitignore
```

### Script 加载顺序（index.html 行 784-793）

```
1. js/state.js           — STATE全局对象
2. js/utils/xss.js       — escapeHtml
3. js/utils/validation.js — truncateUnicode
4. js/storage.js         — saveToStorage/loadFromStorage
5. js/soundfx.js         — SoundFX对象
6. js/navigation.js      — navigateTo/exitModule/showExitModal/closeExitModal/confirmExit
7. js/auth.js            — 登录系统
8. js/journey.js         — renderArchive/newJourney/addStickerToArchive/addStickerAndBack
9. js/worry.js           — 放走坏心情模块(10个函数)
10. js/draw.js            — 绘画投射模块(5个函数+DRAW_IMAGES)
11. <script> 内联业务代码 — 其余所有模块(约1990行)
```

**关键规则**：所有 JS 文件都是普通同步 `<script src>`，不使用 ES Module、不使用 import/export、不使用框架。各脚本共享同一个全局词法环境；顶层函数声明可供后续脚本和 HTML `onclick` 调用。顶层 `const` / `let` 不会自动成为 `window` 属性；只有 `STATE`、`SoundFX` 等通过 `window.STATE = ...`、`window.SoundFX = ...` 显式挂载的对象才可按对应属性从 `window` 访问。

---

## 3. 全局对象和核心依赖

### STATE 对象（js/state.js）

```javascript
const STATE = window.STATE = {
  archives: [],           // 情绪旅程存档 [{id, name, date, stickers:[{emoji,label,mood,date}]}]
  currentJourneyId: null,
  houseState: { base, bg, mood, decos:[], diy:{skin,outfit,acces} },
  atmosphereState: { bg, base, furniture:[], characters:[], done },
  drawState: { imageIdx, q1, q2, q3, done },
  worryState: { fragments:[{text, date}] },
  choiceState: { idx, answers:[], saved, questions:[] },
  currentPage: 'page-home',
  originalTitle: ''
};
```

### 本地存储事实

- `js/storage.js` 的 `soul_journey` 只序列化 `archives`、`houseState`、`drawState`、`worryState`、`choiceState` 五个字段；它不保存 `currentJourneyId`、`atmosphereState`、`currentPage` 或 `originalTitle`，因此不能描述为“整个 STATE”。
- `js/auth.js` 还使用 `login_user_id`、`login_nickname`、`login_provider`、`login_time`、`email_code`、`email_address`、`user_openid`。
- `js/soundfx.js` 使用 `sound_enabled`；`index.html` 的设置面板使用 `api_key`、`api_url`。

### 跨模块核心函数

| 函数 | 所在文件 | 作用 |
|------|----------|------|
| `saveToStorage()` | storage.js | 序列化STATE到localStorage |
| `loadFromStorage()` | storage.js | 从localStorage恢复STATE |
| `saveToStorageDebounced()` | storage.js | 防抖保存(500ms) |
| `navigateTo(pageId)` | navigation.js | 页面切换 + 音效 + 状态保存 |
| `exitModule(pageId)` | navigation.js | 退出模块时检测情绪标签 |
| `addStickerToArchive(emoji,label,mood)` | journey.js | 向当前旅程添加贴纸 |
| `addStickerAndBack(emoji,label,mood)` | journey.js | 添加贴纸 + 返回首页 |
| `renderArchive()` | journey.js | 渲染旅程列表 |
| `escapeHtml(str)` | xss.js | XSS防护：转义HTML文本 |
| `truncateUnicode(str,maxLen)` | validation.js | Unicode安全截断 |
| `SoundFX.*` | soundfx.js | 音效播放 |

---

## 4. Git 提交历史

```
5602e81  04c3-draw-extraction       ← 交接前最后一个产品代码提交
ca03b0a  04c2-worry-extraction
3870981  04c1-journey-extraction
76cf8a6  04b3a-auth-extraction
0f0fa74  04b2b-navigation-extraction
1f12cd4  04b2a-soundfx-extraction
efd126c  04b1-core-state-storage: extract state, storage, xss, validation
d9455ea  04a-css-modularization
2714c52  03-xss-and-input-validation
5672fea  01-baseline-backup
```

分支：`feature/ai-product-v2`

> **注意**：交接前最后一个产品代码提交为 5602e81（04c3-draw-extraction）。提交交接文档后，分支 HEAD 将变为 docs-codex-handoff 提交；Codex 接管时应以真实 `git rev-parse` 结果为准。5602e81 用于证明 04C-4 尚未开始前的产品代码基线。

---

## 5. 重构方法论：机械拆分（Mechanical Extraction）

本项目正在执行一个将巨型 index.html 内联 JS 逐步拆分到独立文件的计划。已完成 3 个业务模块的拆分（journey/worry/draw），还有 3 个业务模块待拆分（house/atmosphere/choice）+ 1 个最终整合阶段（04D，待评估是否需要）。

### 核心原则

1. **逐字保持函数体**：不修改、不优化、不重写任何函数
2. **不引入新依赖**：不使用 ES Module、不使用 import/export、不使用框架
3. **保持全局函数行为**：普通同步 `<script>` 加载，函数直接挂载到 window
4. **不修改文案**：不改用户文案、心理学解读、安慰语
5. **不修改行为**：不改动画时间、音效调用、STATE字段、localStorage格式、XSS防护、输入长度限制
6. **HTML onclick 保留**：所有静态 `onclick=` 属性保持不变
7. **DOMContentLoaded 保留**：不修改 DOMContentLoaded 中的初始化逻辑

### 每个模块的标准拆分步骤

1. **Git 门禁**：确认分支 `feature/ai-product-v2`、HEAD 正确、工作区干净
2. **只读确认**：从 index.html 精确定位函数起止行、顶层变量、模块注释
3. **创建 js/xxx.js**：机械提取函数体到新文件（含分区注释和顶层变量）
4. **修改 index.html**：
   - 在前一个模块的 script 标签后添加 `<script src="js/xxx.js"></script>`
   - 删除已迁移的函数和变量
   - 保留 HTML onclick、DOMContentLoaded 调用、其他模块代码
5. **机械一致性验证**：以父提交为基线，逐函数比较内容一致性
6. **双版本功能回归**：用 `git archive` 建立基线，两个服务器对比测试
7. **XSS 回归**：3 个 payload（`<script>`、`<img onerror>`、`javascript:`）走真实流程+刷新
8. **兼容性检查**：draw.js 返回 200、无新增 console.error、无资源 404
9. **提交门禁**：`git diff --stat` 只有 2 个文件、`git diff --check` 无警告
10. **提交**：`git add index.html js/xxx.js && git commit -m "04cN-xxx-extraction"`
11. **测试残留清理**：临时文件只放系统 TEMP 目录

### 禁止事项

- `git reset`、`git restore`、`git checkout --`、`git clean`
- 删除现有产品文件
- 修改已拆分出的 JS 文件（state/storage/xss/validation/soundfx/navigation/auth/journey/worry/draw）
- 修改 CSS、assets、favicon
- 修改 DOMContentLoaded、末尾音频解锁 script
- 提前开始后续模块（严格顺序）

---

## 6. 已完成的工作

### 阶段 01-03：基础设施

- [x] **01-baseline-backup**：初始基线备份
- [x] **03-xss-and-input-validation**：XSS 防护 + Unicode 安全截断
- [x] **04a-css-modularization**：CSS 拆分到 11 个独立文件

### 阶段 04B：核心基础设施拆分

- [x] **04b1-core-state-storage**：提取 state.js、storage.js、xss.js、validation.js
- [x] **04b2a-soundfx-extraction**：提取 soundfx.js（SoundFX 对象 + updateSoundToggleUI + toggleSoundSetting）
- [x] **04b2b-navigation-extraction**：提取 navigation.js（navigateTo、exitModule、退出弹窗）
- [x] **04b3a-auth-extraction**：提取 auth.js（OAuth、邮箱登录、微信登录、调试登录）

### 阶段 04C：业务模块拆分

- [x] **04c1-journey-extraction**：提取 journey.js
  - 函数：renderArchive、newJourney、renameJourney、deleteJourney、deleteSticker、addStickerToArchive、addStickerAndBack
  - 变量：`_renderArchiveLock`

- [x] **04c2-worry-extraction**：提取 worry.js
  - 函数（10个）：submitWorry、closeStickyNote、shatterWorry、closeShatter、confirmShatter、getWorryComfortMessage、buildWorryInterpretation、closeBottle、renderFragments、reprocessFragment
  - 变量：`currentWorry`

- [x] **04c3-draw-extraction**：提取 draw.js
  - 常量：`DRAW_IMAGES`（3张SVG抽象画）
  - 函数（5个）：startDraw、checkDrawDone、generateEmpathy、buildDrawInterpretation、completeDraw

---

## 7. 待完成的工作

> **下一阶段计划：04C-4 极简小屋机械拆分。目前尚未开始，index.html 中的极简小屋函数仍保持原状。**

### 04C-4：极简小屋（house）模块拆分

**候选迁移内容**（均仍在 index.html 内联 script 中，尚未开始迁移）：

#### 顶层变量
- 无独立顶层变量（状态通过 STATE.houseState 管理）

#### 模块注释
- 行 1079-1081：`// 模块1: 极简小屋`

#### 函数（10个）
| 函数 | 起始行 | 作用 |
|------|--------|------|
| `selectHouseBase(val)` | 1082 | 选择房屋类型 |
| `selectHouseBg(val)` | 1090 | 选择背景 |
| `selectHouseMood(val)` | 1098 | 选择情绪 |
| `toggleDeco(val)` | 1107 | 切换装饰 |
| `selectDiy(cat, val)` | 1120 | 选择自定义项 |
| `updateHousePreview()` | 1131 | 更新预览 |
| `generateHouseSVG(base, bg, mood, decos, diy)` | 1174 | 生成房屋SVG（约200行，最大函数） |
| `getHouseComfortMessage()` | 1382 | 获取安慰语 |
| `buildHouseInterpretation()` | 1418 | 构建心理解读 |
| `completeHouse()` | 1486 | 完成搭建+生成结果页 |

#### HTML 静态 onclick（保留在 index.html）
- `selectHouseBase('classic')` / `selectHouseBase('treehouse')` / `selectHouseBase('igloo')`
- `selectHouseBg('sunset')` / `selectHouseBg('night')` / `selectHouseBg('forest')`
- `selectHouseMood('calm')` / `selectHouseMood('happy')` / ... (5种)
- `toggleDeco('plant')` / `toggleDeco('book')` / ... (9种)
- `selectDiy('skin','light')` / `selectDiy('outfit','casual')` / ... (多种)
- `completeHouse()`
- 结果页动态 `addStickerAndBack('🏡', ...)`

#### DOMContentLoaded 中的恢复逻辑（保留在 index.html）
- 行 952-982：恢复 houseState 选择状态到 UI

#### 跨模块依赖
- `STATE.houseState` — 状态读写
- `SoundFX.setMood()` — `selectHouseMood()` 直接调用，用于设置情绪音效基调
- `toggleCollapse()` — `completeHouse()` 生成的结果页内联 `onclick` 直接引用；该函数目前仍在 `index.html`
- `addStickerAndBack()` — `completeHouse()` 生成的保存按钮内联 `onclick` 直接引用，来自 `journey.js`

这 10 个极简小屋函数当前不直接调用 `SoundFX.click()`、`SoundFX.complete()`、`navigateTo()`、`escapeHtml()` 或 `saveToStorage()`。页面导航、持久化等行为可能在外围流程发生，但不应列为这 10 个函数的直接依赖。

#### 既有基底值映射问题（仅记录，不在 04C-4 修复）

- HTML 选项和 `STATE.houseState.base` 写入值为 `classic`、`treehouse`、`igloo`。
- `getHouseComfortMessage()`、`buildHouseInterpretation()` 的部分判断和映射使用 `classic`、`tree`、`dome`。
- 因此 `treehouse` / `igloo` 无法命中部分使用 `tree` / `dome` 的安慰语或解读分支。这是当前产品代码中已经存在的映射不一致；04C-4 只做机械迁移，必须原样保留，不得借迁移修复。

### 04C-5：氛围小屋（atmosphere）模块拆分

**候选迁移内容**：

#### 顶层变量（8 个，其中 3 个 const + 5 个 let）
- `ATMOSPHERE_ASSETS`（const, 行 835）— 资源路径映射
- `ATMOS_TAB_NAMES`（const, 行 883）
- `atmosCurrentTab`（let, 行 890）
- `atmosDragItem`（let, 行 891）
- `atmosDragOffset`（let, 行 892）
- `atmosCanvasScale`（let, 行 893）
- `atmosPinching`（let, 行 894）
- `ATMOS_MOOD_TIPS`（const, 行 1817）

#### 函数（21个）
| 函数 | 起始行 | 作用 |
|------|--------|------|
| `switchAtmosTab(cat)` | 1525 | 切换素材标签 |
| `renderAtmosAssets(cat)` | 1534 | 渲染素材列表 |
| `selectAtmosBg(path)` | 1555 | 选择背景 |
| `selectAtmosBase(path)` | 1565 | 选择基底 |
| `addAtmosFurniture(path)` | 1574 | 添加家具 |
| `addAtmosCharacter(path)` | 1599 | 添加人物 |
| `createAtmosItem(...)` | 1621 | 创建画布元素 |
| `processAtmosImage(imgEl)` | 1641 | 图片处理/采样 |
| `removeAtmosItem(id)` | 1786 | 移除画布元素 |
| `updateAtmosPlaceholder()` | 1798 | 更新占位提示 |
| `updateAtmosSelectedInfo()` | 1804 | 更新选中信息 |
| `setupAtmosInteraction(el)` | 1826 | 拖拽/缩放交互（约150行） |
| `initAtmosCanvasDeselect()` | 1979 | 点击空白取消选中 |
| `applyAtmosCanvasScale()` | 1992 | 应用缩放 |
| `initAtmosCanvasZoom()` | 1996 | 双指缩放初始化 |
| `completeAtmosphere()` | 2044 | 完成搭建 |
| `sampleAvgColor(imgEl)` | 2145 | 采样平均颜色 |
| `analyzeAtmosphereChoices()` | 2169 | 分析选择 |
| `buildAtmosphereInterpretation()` | 2226 | 构建心理解读 |
| `showAtmosphereResult()` | 2323 | 显示结果页 |
| `initAtmosphere()` | 2378 | 初始化氛围小屋 |

**注意**：`initAtmosphere()` 被 navigation.js 的 `navigateTo()` 调用（导航到 page-atmosphere 时），也 被 DOMContentLoaded 调用。

### 04C-6：此刻心意（choice）模块拆分

**候选迁移内容**：

#### 顶层变量
- `CHOICE_QUESTION_POOL`（行 796）— 题库（约34行）
- `CHOICE_QUESTIONS_COUNT`（行 830）= 10

#### 函数（10个）
| 函数 | 起始行 | 作用 |
|------|--------|------|
| `initChoicePage()` | 2424 | 初始化页面 |
| `resumeChoice()` | 2436 | 继续上次 |
| `startChoice()` | 2444 | 开始答题 |
| `getChoiceQuestions()` | 2464 | 获取题目 |
| `renderChoice()` | 2470 | 渲染当前题 |
| `answerChoice(optionIdx)` | 2495 | 回答 |
| `saveChoiceProgress()` | 2509 | 保存进度 |
| `showChoiceResult()` | 2515 | 显示结果 |
| `getChoiceComfortMessage(...)` | 2599 | 获取安慰语 |
| `buildChoiceInterpretation(...)` | 2635 | 构建深度心理解读（约130行，最长） |

**注意**：`initChoicePage()` 被 navigation.js 的 `navigateTo()` 调用，也被 DOMContentLoaded 调用。

### 04D：最终整合（预计）

完成所有模块拆分后，index.html 应仅剩：
- HTML 结构（页面、组件）
- CSS 引用
- `<script src>` 引用（当前 10 个外部 JS 文件；完成 04C-4～04C-6 后预计 13 个）
- DOMContentLoaded 初始化代码（约90行，行 903-996）
- 吉祥物短句（showMascotBubble 等，约20行）
- 设置面板（toggleSettings、saveApiKey、saveApiUrl、toggleSoundSetting 已在 soundfx.js）
- detectMoodTags（退出弹窗依赖）
- toggleCollapse（通用折叠功能）
- _visibilityGuard / _exitModalTimer 顶层变量
- 末尾音频解锁 script（2行）

预计可能需要：
- 创建 `js/common-ui.js`（toggleCollapse、detectMoodTags、showMascotBubble、MASCOT_QUOTES、mascotTimers）
- 创建 `js/main.js`（DOMContentLoaded 初始化逻辑）
- 或将剩余公共函数直接保留在 index.html 内联中

---

## 8. index.html 内联 script 中剩余的函数清单

以下是 **仍留在 index.html 内联 `<script>` 中** 的所有函数和变量，按位置排序：

### 公共/UI 函数（6 个函数 + 4 个变量）
| 函数/变量 | 行 | 归属 |
|-----------|-----|------|
| `CHOICE_QUESTION_POOL` | 796 | choice 模块（04C-6 待迁移） |
| `CHOICE_QUESTIONS_COUNT` | 830 | choice 模块（04C-6 待迁移） |
| `ATMOSPHERE_ASSETS` | 835 | atmosphere 模块（04C-5 待迁移） |
| `ATMOS_TAB_NAMES` | 883 | atmosphere 模块（04C-5 待迁移） |
| `atmosCurrentTab` | 890 | atmosphere 模块（04C-5 待迁移） |
| `atmosDragItem` | 891 | atmosphere 模块（04C-5 待迁移） |
| `atmosDragOffset` | 892 | atmosphere 模块（04C-5 待迁移） |
| `atmosCanvasScale` | 893 | atmosphere 模块（04C-5 待迁移） |
| `atmosPinching` | 894 | atmosphere 模块（04C-5 待迁移） |
| `_visibilityGuard` | 900 | 公共（可能保留或迁入 common-ui） |
| `_exitModalTimer` | 901 | 公共（可能保留或迁入 common-ui） |
| `DOMContentLoaded` | 903 | 生命周期（保留或迁入 main.js） |
| `MASCOT_QUOTES` | 1001 | 公共（可能保留或迁入 common-ui） |
| `mascotTimers` | 1006 | 公共 |
| `showMascotBubble(el, type)` | 1007 | 公共 |
| `toggleSettings()` | 1031 | 公共（设置面板） |
| `saveApiKey()` | 1044 | 公共（API Key） |
| `saveApiUrl()` | 1050 | 公共（API Key） |
| `detectMoodTags()` | 1056 | 公共（被 exitModule 调用） |
| `toggleCollapse(id)` | 1072 | 公共（通用折叠） |

### 极简小屋函数（04C-4 待迁移）
| 函数 | 行 |
|------|-----|
| `selectHouseBase(val)` | 1082 |
| `selectHouseBg(val)` | 1090 |
| `selectHouseMood(val)` | 1098 |
| `toggleDeco(val)` | 1107 |
| `selectDiy(cat, val)` | 1120 |
| `updateHousePreview()` | 1131 |
| `generateHouseSVG(base, bg, mood, decos, diy)` | 1174 |
| `getHouseComfortMessage()` | 1382 |
| `buildHouseInterpretation()` | 1418 |
| `completeHouse()` | 1486 |

### 氛围小屋函数（04C-5 待迁移）
| 函数 | 行 |
|------|-----|
| `switchAtmosTab(cat)` | 1525 |
| `renderAtmosAssets(cat)` | 1534 |
| `selectAtmosBg(path)` | 1555 |
| `selectAtmosBase(path)` | 1565 |
| `addAtmosFurniture(path)` | 1574 |
| `addAtmosCharacter(path)` | 1599 |
| `createAtmosItem(...)` | 1621 |
| `processAtmosImage(imgEl)` | 1641 |
| `ATMOS_MOOD_TIPS` | 1817 |
| `removeAtmosItem(id)` | 1786 |
| `updateAtmosPlaceholder()` | 1798 |
| `updateAtmosSelectedInfo()` | 1804 |
| `setupAtmosInteraction(el)` | 1826 |
| `initAtmosCanvasDeselect()` | 1979 |
| `applyAtmosCanvasScale()` | 1992 |
| `initAtmosCanvasZoom()` | 1996 |
| `completeAtmosphere()` | 2044 |
| `sampleAvgColor(imgEl)` | 2145 |
| `analyzeAtmosphereChoices()` | 2169 |
| `buildAtmosphereInterpretation()` | 2226 |
| `showAtmosphereResult()` | 2323 |
| `initAtmosphere()` | 2378 |

### 此刻心意函数（04C-6 待迁移）
| 函数 | 行 |
|------|-----|
| `initChoicePage()` | 2424 |
| `resumeChoice()` | 2436 |
| `startChoice()` | 2444 |
| `getChoiceQuestions()` | 2464 |
| `renderChoice()` | 2470 |
| `answerChoice(optionIdx)` | 2495 |
| `saveChoiceProgress()` | 2509 |
| `showChoiceResult()` | 2515 |
| `getChoiceComfortMessage(...)` | 2599 |
| `buildChoiceInterpretation(...)` | 2635 |

---

## 9. 关键测试规范

> 本节包含此前阶段留下的历史验收记录和后续测试规范。本轮 HANDOFF.md 事实修正没有重新执行浏览器功能、XSS、视口或双版本回归测试；下述历史结果不得表述或理解为本轮测试结论。

### XSS 防护机制

本项目使用两种 XSS 防护方式：
1. **createElement + textContent**（首选）：所有用户输入通过 DOM API 设置，不经过 innerHTML
2. **escapeHtml()**（备选）：将文本转义后插入 innerHTML 模板字符串

历史验收记录中标注为已验证的安全点：
- 旅程名称：`truncateUnicode(name, 30)` → `textContent` 设置
- worry 碎片：`textContent` 渲染
- draw 问答：`textContent` 渲染
- 结果页：动态 onclick 中的用户数据通过 `escapeHtml` 转义

### 测试时需要的 3 个 XSS payload

1. `<script>alert(1)</script>`
2. `<img src=x onerror=alert(1)>`
3. `javascript:alert(1)`

每个 payload 需要走真实业务流程 → 刷新页面 → 重新验证。通过标准：
- alertCount = 0
- script 标签数不增加
- img[onerror] 不增加
- localStorage 保存原始文本（非 HTML 实体）
- DOM 以纯文本显示
- 无双重转义

### 双版本基线测试

每个模块拆分后，需要：
1. 用 `git archive --format=tar HEAD` 提取基线版本到临时目录
2. 启动两个 HTTP 服务器（基线端口 + 当前端口）
3. 对两个版本执行完全相同的操作
4. 比较 STATE、DOM、localStorage 结果是否一致

### 历史验收时记录的环境限制

- 自动化浏览器无法设置精确视口（1366×768 / 390×844），需标注 BLOCKED 由人工补测
- `prompt()`/`confirm()` 在自动化环境中不可用，需安装测试替身：
  ```javascript
  window.alert = function() {};
  window.prompt = function(msg, def) { return def; };
  window.confirm = function() { return true; };
  ```

---

## 10. 模块间的调用关系图

```
index.html (HTML结构 + onclick)
    │
    ├── state.js ── STATE 全局对象
    ├── xss.js ── escapeHtml()
    ├── validation.js ── truncateUnicode()
    ├── storage.js ── saveToStorage() / loadFromStorage()
    ├── soundfx.js ── SoundFX.* / updateSoundToggleUI() / toggleSoundSetting()
    ├── navigation.js ── navigateTo() / exitModule() / showExitModal() / closeExitModal() / confirmExit()
    │       └── 调用: detectMoodTags() (仍在index.html)
    │       └── 调用: initAtmosphere() (将在04C-5迁移到atmosphere.js)
    │       └── 调用: initChoicePage() (将在04C-6迁移到choice.js)
    ├── auth.js ── initLoginPage() / handleOAuthCallback() / checkLoginStatus()
    ├── journey.js ── renderArchive() / newJourney() / addStickerToArchive() / addStickerAndBack()
    ├── worry.js ── 10个函数
    │       └── 调用: addStickerToArchive() (journey.js)
    │       └── 调用: navigateTo() (navigation.js)
    │       └── 调用: SoundFX.* (soundfx.js)
    ├── draw.js ── 5个函数 + DRAW_IMAGES
    │       └── 调用: addStickerAndBack() (journey.js)
    │       └── 调用: SoundFX.* (soundfx.js)
    │       └── 调用: escapeHtml() (xss.js)
    │
    └── index.html 内联 script
            ├── DOMContentLoaded
            │       ├── initLoginPage() (auth.js)
            │       ├── handleOAuthCallback() (auth.js)
            │       ├── checkLoginStatus() (auth.js)
            │       ├── loadFromStorage() (storage.js)
            │       ├── renderArchive() (journey.js)
            │       ├── SoundFX.init() (soundfx.js)
            │       ├── updateSoundToggleUI() (soundfx.js)
            │       ├── renderFragments() (worry.js)
            │       ├── updateHousePreview() (待迁移到house.js)
            │       ├── initAtmosphere() (待迁移到atmosphere.js)
            │       ├── initChoicePage() (待迁移到choice.js)
            │       └── SoundFX.setMood() (soundfx.js)
            ├── 公共函数 (showMascotBubble, toggleSettings, detectMoodTags, toggleCollapse, ...)
            ├── 极简小屋函数 (04C-4 待迁移)
            ├── 氛围小屋函数 (04C-5 待迁移)
            └── 此刻心意函数 (04C-6 待迁移)
```

---

## 11. 后续执行建议

### 执行顺序

```
04C-4: house.js (极简小屋)
  ↓
04C-5: atmosphere.js (氛围小屋)
  ↓
04C-6: choice.js (此刻心意)
  ↓
04D: 最终整合 (common-ui.js + main.js 或保留内联)
```

### 每个模块的预期产出

| 模块 | 新文件 | 预计行数 | 函数数 | 顶层变量 |
|------|--------|----------|--------|----------|
| 04C-4 house | js/house.js | ~450 | 10 | 0 |
| 04C-5 atmosphere | js/atmosphere.js | ~900 | 21 | 8 |
| 04C-6 choice | js/choice.js | ~310 | 10 | 2 |

### 提交命名规范

```
04c4-house-extraction
04c5-atmosphere-extraction
04c6-choice-extraction
04d-final-integration (如有)
```

### 提交后预期 script 加载顺序

完成 04C-6 后：

```
state.js → xss.js → validation.js → storage.js → soundfx.js
→ navigation.js → auth.js → journey.js → worry.js → draw.js
→ house.js → atmosphere.js → choice.js
→ 内联 (DOMContentLoaded + 公共UI函数)
```

---

## 12. 重要提醒

1. **不要修改已拆分的 JS 文件**：state.js、storage.js、xss.js、validation.js、soundfx.js、navigation.js、auth.js、journey.js、worry.js、draw.js 在对应拆分阶段留有历史验收记录；本轮未重新执行这些测试。后续机械拆分默认不要修改这些文件。

2. **HTML onclick 属性必须保留**：所有 `onclick="functionName()"` 是全局函数调用的入口，不能改为 addEventListener。

3. **DOMContentLoaded 不能拆分**：它包含了跨模块的状态恢复逻辑（house UI 恢复、atmosphere 初始化、choice 初始化），这些调用依赖 DOM 已加载。

4. **generateHouseSVG 是最大的单体函数**（约200行），生成完整的 SVG 字符串，包含大量硬编码的路径数据。迁移时必须逐字保持。

5. **buildChoiceInterpretation 是最长的心理学解读函数**（约130行），包含7个分析维度。迁移时必须逐字保持。

6. **navigation.js 中的 navigateTo() 调用了 initAtmosphere() 和 initChoicePage()**：这两个函数目前仍在 index.html 内联中。当 04C-5 和 04C-6 完成后，它们会移到 atmosphere.js 和 choice.js，navigateTo() 的调用不需要修改（因为全局函数在 script 加载后可用）。

7. **localStorage 使用多个 key**：`soul_journey` 只保存 `archives`、`houseState`、`drawState`、`worryState`、`choiceState`；登录演示、音效和 API 设置还使用“本地存储事实”中列出的其他 key。机械拆分不得改变既有 key 或数据格式。

8. **测试临时文件必须放在系统 TEMP 目录**，不要在项目根目录留下 baseline_*、test_*.py、qa_* 等文件。

9. **dist/ 和 dist.zip 是旧产物**，已在 .gitignore 中，不要提交。

10. **API Key 仅为 UI 预留功能**：设置面板中的 OpenAI API Key 输入框只做 localStorage 存取（`api_key`、`api_url`），没有任何实际的 `fetch()` 调用或 AI 请求代码。心理学解读全部是本地硬编码的规则逻辑，不依赖任何后端。

11. **登录方式需要区分**：GitHub 和 Google 按钮会跳转到各自 OAuth 授权地址，回调地址配置为腾讯云开发函数；前端收到 `code` 后仅做演示提示，不交换 token，也不会自动登录。微信入口通过 `window.postMessage({ type: 'getWxLogin' })` 发起，并监听 `wxLoginSuccess` 消息，不是 OAuth 跳转。邮箱验证码由前端随机生成、写入 `localStorage` 并直接显示在提示框中，属于演示登录，不是服务端邮件认证。该项目本身没有后端服务器或数据库。
