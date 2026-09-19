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
├── index.html              (994行) HTML结构 + 剩余公共内联JS
├── favicon.svg             静态 SVG 图标
├── CHANGELOG.md            提交级变更记录
├── docs/
│   ├── PRODUCT_EVOLUTION.md 产品演进记录
│   └── TESTING.md           04C-4～05A 实际验收证据
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
│   ├── storage.js          localStorage读写(55行)
│   ├── soundfx.js          音效系统(85行)
│   ├── navigation.js       页面导航+退出弹窗(62行)
│   ├── auth.js             GitHub/Google OAuth 演示、微信 postMessage、邮箱演示登录(211行)
│   ├── journey.js          旅程管理+贴纸(171行)
│   ├── worry.js            放走坏心情模块(225行)
│   ├── draw.js             绘画投射模块(534行)
│   ├── house.js            极简小屋模块（442行、10个函数）
│   ├── atmosphere.js       氛围小屋模块（1112行；含状态恢复与生命周期治理）
│   └── choice.js           此刻心意模块（382行、2个常量、10个函数）
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

### Script 加载顺序（index.html 行 785-797）

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
10. js/draw.js           — 绘画投射模块(5个函数+DRAW_IMAGES)
11. js/house.js          — 极简小屋模块(10个函数)
12. js/atmosphere.js     — 氛围小屋模块(8个顶层值+21个函数)
13. js/choice.js         — 此刻心意模块(2个常量+10个函数)
14. <script> 主内联代码 — 生命周期、状态恢复及公共UI
15. <script> 末尾音频解锁代码
```

**当前外部 JS 数量：13；内联 script 数量：2。** 加载顺序为 state → xss → validation → storage → soundfx → navigation → auth → journey → worry → draw → house → atmosphere → choice → 主内联 script → 音频解锁 script。仓库另有 11 个 CSS、14 个 WAV 和根目录 `favicon.svg`。

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

- `js/storage.js` 的 `soul_journey` 序列化 `archives`、`houseState`、`atmosphereState`、`drawState`、`worryState`、`choiceState` 六个字段；它不保存 `currentJourneyId`、`currentPage` 或 `originalTitle`，因此不能描述为“整个 STATE”。缺少 `atmosphereState` 的旧数据保留默认值；缺失或类型异常的家具、人物数组降级为空数组；数组中的异常记录会被过滤。
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
bfeffb0  fix-atmosphere-mobile-default-placement  ← 05A 稳定性验收时最后产品代码提交
d8b4edd  fix-atmosphere-lifecycle-cleanup
13406c4  fix-atmosphere-state-persistence
a1d021d  fix-house-base-value-mapping
84bcac3  docs-final-modularization-handoff
71078ef  04c6-choice-extraction       ← 模块化阶段最后产品代码提交
793f3d5  04c5-atmosphere-extraction
0eeb114  docs-04c4-product-and-engineering-update
2fb8a7e  fix-house-mobile-tooltip-overflow  ← 04C-4 正式关闭时的最后产品代码提交
7ad9cd2  fix-favicon-404
b7f1a44  04c4-house-extraction
a0a0c50  docs-handoff-accuracy-fixes
cd8bef8  docs-codex-handoff
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

> **注意**：交接前最后产品代码提交为 5602e81；04C-4 正式关闭时为 2fb8a7e；模块化阶段最后产品代码提交为 71078ef；05A 稳定性验收时最后产品代码提交为 bfeffb0。它们是阶段基线，不是永久“当前 HEAD”。每次任务开始须以真实 `git rev-parse --short HEAD` 为准。

---

## 5. 重构方法论：机械拆分（Mechanical Extraction）

本项目将巨型 `index.html` 内联 JS 逐步拆分到独立文件的机械拆分计划已经完成：04C-1～04C-6 全部完成，04D 本地最终整合验收通过。以下方法论保留为历史工程规范和后续类似迁移的参考，不表示仍有待执行的机械拆分阶段。

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
8. **兼容性检查**：新模块 JS 返回 200、无新增 console.error、无资源 404
9. **提交门禁**：`git diff --stat` 只有 2 个文件、`git diff --check` 无警告
10. **提交**：`git add index.html js/xxx.js && git commit -m "04cN-xxx-extraction"`
11. **测试残留清理**：临时文件只放系统 TEMP 目录

### 禁止事项

- `git reset`、`git restore`、`git checkout --`、`git clean`
- 删除现有产品文件
- 无明确独立任务时修改已拆分出的 13 个 JS 文件（state/xss/validation/storage/soundfx/navigation/auth/journey/worry/draw/house/atmosphere/choice）
- 修改 CSS、assets、favicon（机械拆分期间；独立质量修复另有提交与验收）
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

- [x] **04c4-house-extraction**：提取 house.js（10 个函数，无独立顶层变量），与 a0a0c50 基线逐字一致，产品级最终回归 FAIL=0、BLOCKED=0

- [x] **04c5-atmosphere-extraction**：提取 atmosphere.js（8 个顶层值、21 个函数），与 0eeb114 基线机械一致，双版本回归 FAIL=0、BLOCKED=0

- [x] **04c6-choice-extraction**：提取 choice.js（2 个常量、10 个函数），与 793f3d5 基线机械一致，双版本回归 FAIL=0、BLOCKED=0

- [x] **04D 本地最终整合验收**：完整五模块闭环、存储刷新、XSS、七视口、资源和运行时检查全部通过，FAIL=0、BLOCKED=0；该结论是本地产品验收，不代表生产发布

### 04C-4 独立质量修复与最终验收

- `7ad9cd2`：新增 `favicon.svg` 并在 `index.html` head 声明图标，浏览器默认 `/favicon.ico` 404 已消失。
- `2fb8a7e`：在 `css/responsive.css` 为 480px 以下装饰提示框设 120px 宽并允许换行，原 390×844 的 9px 横向溢出已消失。
- 两项问题在 a0a0c50 拆分前基线同样存在，并非 house.js 引入。04C-4 完整实测见 `docs/TESTING.md`；最终 FAIL=0、BLOCKED=0。

### 阶段 05A：模块化封版后的稳定性修复

- [x] **05A-1 `a1d021d`**：将 house 解读中的旧 `tree` / `dome` 分支改为真实输入值 `treehouse` / `igloo`；三种基底均命中对应 SVG、安慰语和专业解读。
- [x] **05A-2 `13406c4`**：将 `atmosphereState` 纳入 `soul_journey`，兼容旧数据与异常记录；背景、基底、家具、人物、位置、尺寸和 `done` 可刷新恢复，再次进入不再清空场景。
- [x] **05A-3 `d8b4edd`**：为动态元素、画布监听器及完成动画 timer 建立可重复清理的生命周期；离开氛围页后临时监听器和 timer 归零，无迟到结果或音效。
- [x] **移动端默认位置 `bfeffb0`**：修正右侧默认模板，并仅对新添加元素按实际图片尺寸夹取到画布范围内；已持久化坐标与用户拖动坐标不改写。七个视口、35 个默认元素循环实测无裁切。
- [x] **05A 最终验收**：完整五模块、五类贴纸、存储兼容、三种基底、状态转换、监听器与 timer、XSS、七视口、资源和运行时全部通过，FAIL=0、BLOCKED=0；不代表生产发布。

---

## 7. 04C-4～05A 完成状态与模块边界

> **04C-4、04C-5、04C-6 和 04D 本地最终整合验收均已完成。当前没有待执行的机械拆分阶段。** 后续产品优化、真实 AI 接入或已知问题修复须单独授权。

### 04C-4：极简小屋（house）模块拆分（已完成）

**已迁移内容**（下列行号仅指 a0a0c50 拆分前基线；当前定义在 js/house.js）：

#### 顶层变量
- 无独立顶层变量（状态通过 STATE.houseState 管理）

#### 模块注释
- a0a0c50 基线行 1079-1081：`// 模块1: 极简小屋`；模块注释已迁入 `js/house.js`

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
- a0a0c50 基线行 952-982：恢复 houseState 选择状态到 UI；当前 `index.html` 中逻辑保留原样

#### 跨模块依赖
- `STATE.houseState` — 状态读写
- `SoundFX.setMood()` — `selectHouseMood()` 直接调用，用于设置情绪音效基调
- `toggleCollapse()` — `completeHouse()` 生成的结果页内联 `onclick` 直接引用；该函数目前仍在 `index.html`
- `addStickerAndBack()` — `completeHouse()` 生成的保存按钮内联 `onclick` 直接引用，来自 `journey.js`

这 10 个极简小屋函数不直接调用 `SoundFX.click()`、`SoundFX.complete()`、`navigateTo()`、`escapeHtml()` 或 `saveToStorage()`。页面导航、持久化等行为可能在外围流程发生，但不应列为这 10 个函数的直接依赖。

#### 基底值映射问题（05A-1 已解决）

- HTML 选项和 `STATE.houseState.base` 写入值为 `classic`、`treehouse`、`igloo`。
- 04C-4 机械拆分时，`getHouseComfortMessage()`、`buildHouseInterpretation()` 的部分判断和映射仍使用 `tree`、`dome`，该历史行为当时原样保留。
- `a1d021d fix-house-base-value-mapping` 已将其统一为真实输入值 `treehouse`、`igloo`，没有修改 HTML、STATE、存储结构、SVG 或文案；05A 最终验收确认三种基底均命中正确分支。

### 04C-5：氛围小屋（atmosphere）模块拆分（已完成）

**已迁移内容**：下列行号指 0eeb114 拆分前基线；当前定义位于 `js/atmosphere.js`，提交为 `793f3d5 04c5-atmosphere-extraction`。

#### 顶层变量（8 个，其中 3 个 const + 5 个 let）
- `ATMOSPHERE_ASSETS`（const, 行 837）— 资源路径映射
- `ATMOS_TAB_NAMES`（const, 行 885）
- `atmosCurrentTab`（let, 行 892）
- `atmosDragItem`（let, 行 893）
- `atmosDragOffset`（let, 行 894）
- `atmosCanvasScale`（let, 行 895）
- `atmosPinching`（let, 行 896）
- `ATMOS_MOOD_TIPS`（const, 行 1376）

#### 函数（21个）
| 函数 | 起始行 | 作用 |
|------|--------|------|
| `switchAtmosTab(cat)` | 1084 | 切换素材标签 |
| `renderAtmosAssets(cat)` | 1093 | 渲染素材列表 |
| `selectAtmosBg(path)` | 1114 | 选择背景 |
| `selectAtmosBase(path)` | 1124 | 选择基底 |
| `addAtmosFurniture(path)` | 1133 | 添加家具 |
| `addAtmosCharacter(path)` | 1158 | 添加人物 |
| `createAtmosItem(...)` | 1180 | 创建画布元素 |
| `processAtmosImage(imgEl)` | 1200 | 图片处理/采样 |
| `removeAtmosItem(id)` | 1345 | 移除画布元素 |
| `updateAtmosPlaceholder()` | 1357 | 更新占位提示 |
| `updateAtmosSelectedInfo()` | 1363 | 更新选中信息 |
| `setupAtmosInteraction(el)` | 1385 | 拖拽/缩放交互（约150行） |
| `initAtmosCanvasDeselect()` | 1538 | 点击空白取消选中 |
| `applyAtmosCanvasScale()` | 1551 | 应用缩放 |
| `initAtmosCanvasZoom()` | 1555 | 双指缩放初始化 |
| `completeAtmosphere()` | 1603 | 完成搭建 |
| `sampleAvgColor(imgEl)` | 1704 | 采样平均颜色 |
| `analyzeAtmosphereChoices()` | 1728 | 分析选择 |
| `buildAtmosphereInterpretation()` | 1785 | 构建心理解读 |
| `showAtmosphereResult()` | 1882 | 显示结果页 |
| `initAtmosphere()` | 1937 | 初始化氛围小屋 |

#### 跨模块依赖

- `STATE.atmosphereState` — 保存背景、基底、家具、人物与 `done` 字段；自 `13406c4` 起纳入 `soul_journey`，并兼容缺字段、错误数组类型和异常记录。
- `SoundFX.click/select/place/animBg/animBase/complete()` — 标签、素材选择、放置和完成动画的直接音效调用。
- `toggleCollapse()` — `showAtmosphereResult()` 生成的解读折叠入口引用，当前仍在 `index.html` 公共 UI。
- `addStickerAndBack()` — 结果页保存按钮引用，来自 `journey.js`。
- `navigateTo()` 位于 `navigation.js`；进入 `page-atmosphere` 时由它调用 `initAtmosphere()`。

**注意**：`initAtmosphere()` 被 navigation.js 的 `navigateTo()` 调用（导航到 page-atmosphere 时），也被 DOMContentLoaded 调用。迁移保留这些入口和全部静态、动态 `onclick`。8 个顶层值、21 个函数、注释与真实相对顺序均与 0eeb114 基线一致；Mouse、Touch、Wheel、Canvas、五阶段完成动画、贴纸、资源和其他模块烟雾回归均实际执行，FAIL=0、BLOCKED=0。

05A 在机械拆分后的模块边界内增量修复产品行为：`initAtmosphere()` 会先清理旧动态 DOM 和交互绑定，再从纯数据状态恢复场景；完成动画生成结果时写入并保存 `done=true`，有效编辑后重置为 `false`；`cleanupAtmosphere()` 在统一导航离开氛围页时撤销临时监听器并清除动画 timer。新添加元素会在图片尺寸可用后夹取到画布内，恢复已有场景时不改写持久化坐标。

### 04C-6：此刻心意（choice）模块拆分（已完成）

**已迁移内容**：下列行号指 793f3d5 拆分前基线；当前定义位于 `js/choice.js`，提交为 `71078ef 04c6-choice-extraction`。

#### 顶层变量
- `CHOICE_QUESTION_POOL`（行 799）— 题库（约34行）
- `CHOICE_QUESTIONS_COUNT`（行 833）= 10

#### 函数（10个）
| 函数 | 起始行 | 作用 |
|------|--------|------|
| `initChoicePage()` | 1020 | 初始化页面 |
| `resumeChoice()` | 1032 | 继续上次 |
| `startChoice()` | 1040 | 开始答题 |
| `getChoiceQuestions()` | 1060 | 获取题目 |
| `renderChoice()` | 1066 | 渲染当前题 |
| `answerChoice(optionIdx)` | 1091 | 回答 |
| `saveChoiceProgress()` | 1105 | 保存进度 |
| `showChoiceResult()` | 1111 | 显示结果 |
| `getChoiceComfortMessage(...)` | 1195 | 获取安慰语 |
| `buildChoiceInterpretation(...)` | 1231 | 构建深度心理解读（约130行，最长） |

**注意**：`initChoicePage()` 被 navigation.js 的 `navigateTo()` 调用，也被 DOMContentLoaded 调用。迁移保留随机抽题、十题顺序、进度保存、退出、继续、刷新恢复、结果和贴纸流程。2 个常量和 10 个函数与 793f3d5 基线一致；双版本实际回归 FAIL=0、BLOCKED=0。

### 04D：最终整合验收（本地已通过）

完成所有模块拆分后，index.html 当前仅剩：
- HTML 结构（页面、组件）
- CSS 引用
- `<script src>` 引用（13 个外部 JS 文件）
- DOMContentLoaded 初始化代码（约90行；实际行号以当前 `index.html` 为准）
- 吉祥物短句（showMascotBubble 等；实际行号以当前 `index.html` 为准）
- 设置面板（toggleSettings、saveApiKey、saveApiUrl、toggleSoundSetting 已在 soundfx.js）
- detectMoodTags（退出弹窗依赖）
- toggleCollapse（通用折叠功能）
- _visibilityGuard / _exitModalTimer 顶层变量
- 末尾音频解锁 script（2行）

如后续有明确授权，可评估：
- 创建 `js/common-ui.js`（toggleCollapse、detectMoodTags、showMascotBubble、MASCOT_QUOTES、mascotTimers）
- 创建 `js/main.js`（DOMContentLoaded 初始化逻辑）
- 或将剩余公共函数直接保留在 index.html 内联中

04D 在本地干净 `71078ef` 上实际完成登录、旅程增删改、五模块完整流程、同一旅程五类贴纸、刷新与存储、三个 XSS payload、七个视口、资源和运行时检查。产品测试 FAIL=0、BLOCKED=0。随后 05A 基于 `bfeffb0` 重新执行稳定性最终验收，亦为 FAIL=0、BLOCKED=0。两者都不表示已经生产发布。

---

## 8. index.html 内联 script 中剩余的函数清单

以下是 **仍留在当前 `index.html` 主内联 `<script>` 中** 的全部顶层值、生命周期入口和函数，按磁盘源码位置重新生成。house、atmosphere、choice 已分别迁入外部文件，不再有对应内联定义。

### 顶层值、生命周期与公共/UI

| 函数/变量 | 当前行 | 归属 |
|---|---:|---|
| `_visibilityGuard` | 803 | 公共 UI 状态 |
| `_exitModalTimer` | 804 | 公共 UI 定时器 |
| `DOMContentLoaded` 回调 | 806 | 登录、存储、模块恢复和音效初始化 |
| `MASCOT_QUOTES` | 904 | 吉祥物短句 |
| `mascotTimers` | 909 | 吉祥物气泡定时器 |
| `showMascotBubble(el, type)` | 910 | 吉祥物气泡 |
| `toggleSettings()` | 934 | 设置面板 |
| `saveApiKey()` | 947 | API Key 预留 UI 的本地存取 |
| `saveApiUrl()` | 953 | API URL 预留 UI 的本地存取 |
| `detectMoodTags()` | 959 | 退出弹窗依赖 |
| `toggleCollapse(id)` | 975 | 通用折叠 |

末尾第二个内联 script 位于 988～991 行，只注册首次 `touchstart` / `click` 的音频解锁监听器，没有顶层函数或变量定义。

---

## 9. 关键测试规范

> 本节包含机械拆分阶段形成的测试规范。04C-4、04C-5、04C-6、04D 和 05A 的实际执行证据见 `docs/TESTING.md`。

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

- 历史环境曾无法设置精确视口；04C-4 最终验收已用 CDP 实际设置七个目标视口，并在 `docs/TESTING.md` 记录真实数值
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
    │       └── 调用: initAtmosphere() (atmosphere.js)
    │       └── 调用: initChoicePage() (choice.js)
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
    ├── house.js ── 10 个极简小屋函数
    │       ├── 调用: STATE.houseState / SoundFX.setMood()
    │       └── 动态按钮引用: toggleCollapse() / addStickerAndBack()
    │
    ├── atmosphere.js ── 8 个顶层值 + 21 个氛围小屋函数
    │       ├── 调用: STATE.atmosphereState / SoundFX.*
    │       └── 动态按钮引用: toggleCollapse() / addStickerAndBack()
    │
    ├── choice.js ── 2 个常量 + 10 个此刻心意函数
    │       ├── 调用: STATE.choiceState / saveToStorage() / SoundFX.*
    │       └── 动态按钮引用: toggleCollapse() / addStickerAndBack()
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
            │       ├── updateHousePreview() (house.js)
            │       ├── initAtmosphere() (atmosphere.js)
            │       ├── initChoicePage() (choice.js)
            │       └── SoundFX.setMood() (soundfx.js)
            └── 公共函数 (showMascotBubble, toggleSettings, saveApiKey, saveApiUrl, detectMoodTags, toggleCollapse)
```

---

## 11. 后续执行建议

### 已完成顺序

```
04C-4: house.js (极简小屋，已完成并正式验收)
  ↓
04C-5: atmosphere.js (氛围小屋，已完成并通过双版本验收)
  ↓
04C-6: choice.js (此刻心意，已完成并通过双版本验收)
  ↓
04D: 本地最终整合验收 (保留当前公共内联代码，FAIL=0、BLOCKED=0)
```

当前没有待执行的机械拆分或 05A 修复阶段。下一阶段如获独立授权，应先进行真实 AI 产品架构、安全、隐私和服务端边界设计；公共内联代码整理、产品指标与评估体系也须作为独立任务。不得把这些建议视为已经开始。

### 各模块实际产出

| 模块 | 新文件 | 当前行数 | 函数数 | 顶层值 |
|------|--------|----------|--------|----------|
| 04C-4 house | js/house.js | 442 | 10 | 0 |
| 04C-5 atmosphere | js/atmosphere.js | 1112 | 21 个原拆分函数，另含 05A 生命周期与适配辅助函数 | 8 个原拆分顶层值，另含 05A 生命周期状态 |
| 04C-6 choice | js/choice.js | 382 | 10 | 2 |

### 提交命名规范

```
04c4-house-extraction
04c5-atmosphere-extraction
04c6-choice-extraction
docs-final-modularization-handoff
fix-house-base-value-mapping
fix-atmosphere-state-persistence
fix-atmosphere-lifecycle-cleanup
fix-atmosphere-mobile-default-placement
docs-05a-stability-handoff
```

### 当前 script 加载顺序

```
state.js → xss.js → validation.js → storage.js → soundfx.js
→ navigation.js → auth.js → journey.js → worry.js → draw.js
→ house.js → atmosphere.js → choice.js
→ 内联 (DOMContentLoaded + 公共UI函数)
```

---

## 12. 重要提醒

1. **不要在无明确任务时修改已拆分的 JS 文件**：state.js、xss.js、validation.js、storage.js、soundfx.js、navigation.js、auth.js、journey.js、worry.js、draw.js、house.js、atmosphere.js、choice.js 均已通过阶段验收。

2. **HTML onclick 属性必须保留**：所有 `onclick="functionName()"` 是全局函数调用的入口，不能改为 addEventListener。

3. **DOMContentLoaded 不能拆分**：它包含了跨模块的状态恢复逻辑（house UI 恢复、atmosphere 初始化、choice 初始化），这些调用依赖 DOM 已加载。

4. **generateHouseSVG 是已迁移的大型函数**（约200行），生成完整的 SVG 字符串，包含大量硬编码的路径数据。04C-4 与 a0a0c50 基线逐字一致；后续不得借机械拆分修改。

5. **buildChoiceInterpretation 是较长的心理学解读函数**（约130行），包含7个分析维度；已迁入 `choice.js` 并与 793f3d5 基线保持一致。

6. **navigation.js 中的 navigateTo() 调用了 initAtmosphere() 和 initChoicePage()**：两个函数现分别位于 `atmosphere.js` 和 `choice.js`；普通同步 script 的加载顺序保证调用可用。

7. **localStorage 使用多个 key**：`soul_journey` 保存 `archives`、`houseState`、`atmosphereState`、`drawState`、`worryState`、`choiceState`；登录演示、音效和 API 设置还使用“本地存储事实”中列出的其他 key。后续不得无独立迁移方案改变既有 key 或数据格式。

8. **测试临时文件必须放在系统 TEMP 目录**，不要在项目根目录留下 baseline_*、test_*.py、qa_* 等文件。

9. **dist/ 和 dist.zip 是旧产物**，已在 .gitignore 中，不要提交。

10. **API Key 仅为 UI 预留功能**：设置面板中的 OpenAI API Key 输入框只做 localStorage 存取（`api_key`、`api_url`），没有任何实际的 `fetch()` 调用或 AI 请求代码。心理学解读全部是本地硬编码的规则逻辑，不依赖任何后端。

11. **登录方式需要区分**：GitHub 和 Google 按钮会跳转到各自 OAuth 授权地址，回调地址配置为腾讯云开发函数；前端收到 `code` 后仅做演示提示，不交换 token，也不会自动登录。微信入口通过 `window.postMessage({ type: 'getWxLogin' })` 发起，并监听 `wxLoginSuccess` 消息，不是 OAuth 跳转。邮箱验证码由前端随机生成、写入 `localStorage` 并直接显示在提示框中，属于演示登录，不是服务端邮件认证。该项目本身没有后端服务器或数据库。

12. **当前阶段与问题状态**：04C-1～04C-6、04D 和 05A 均已完成。基底映射、氛围状态持久化、`done`、再次进入清空元素、监听器与动画 timer 清理、320px 默认位置裁切已分别在 05A 解决并通过最终验收。当前仍未解决的是演示认证、仅本地保存且不发 AI 请求的 API Key UI，以及尚未实现真实 AI、Safety Guard、Agent、服务端 Gateway 和数据库。

13. **专题文档**：产品演进见 `docs/PRODUCT_EVOLUTION.md`，04C-4～05A 实际验收证据见 `docs/TESTING.md`，提交级变更见 `CHANGELOG.md`。这些文件仅记录已确认事实与规划边界。
