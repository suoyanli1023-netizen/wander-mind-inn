# 模块化阶段测试与最终整合验收记录

## 记录范围、日期与环境

**历史实际执行（04C-4）：** 2026-09-16，Windows 本地静态服务器、干净的 headless Chrome 会话与 Chrome DevTools Protocol；通过浏览器输入、点击、刷新和实际视口设置检查 `2fb8a7e`。自动化所需的 `alert` 计数器及旅程重命名／删除用 `prompt`、`confirm` 替身仅在测试浏览器内存中安装，不写入产品。测试基线与脚本只在系统临时目录，服务器和数据已在结束时清理。

**历史验收记录：** 04C-1、04C-2、04C-3 等阶段在交接文档中留有当时的验收说明；其结果不能作为本次实测。`a0a0c50` 双版本比较是 04C-4 期间实际执行的基线核对。

**当前实际执行：** 2026-09-17，04C-5、04C-6 双版本回归与 `71078ef` 上的 04D 本地最终整合验收均已完成。本文第 9 节起记录该轮证据。本次文档同步没有重新执行浏览器测试。

**尚未执行：** AI Gateway、Safety Guard、真实服务端认证、数据库及生产部署验收，因为这些能力尚未实现。

## 1. Git 基线与提交链

验收门禁实际核对：分支 `feature/ai-product-v2`，HEAD `2fb8a7e`，工作区干净。连续提交链为 `a0a0c50 docs-handoff-accuracy-fixes` → `b7f1a44 04c4-house-extraction` → `7ad9cd2 fix-favicon-404` → `2fb8a7e fix-house-mobile-tooltip-overflow`。三个产品提交文件边界分别仅为 `index.html`+`js/house.js`、`index.html`+`favicon.svg`、`css/responsive.css`；未修改其他业务模块或 `AGENTS.md` / `HANDOFF.md`。

## 2. 机械一致性

从 `a0a0c50:index.html` 提取函数源码，与当前 `js/house.js` 逐函数比较。下列 10 个函数**逐字一致，顺序一致**：`selectHouseBase`、`selectHouseBg`、`selectHouseMood`、`toggleDeco`、`selectDiy`、`updateHousePreview`、`generateHouseSVG`、`getHouseComfortMessage`、`buildHouseInterpretation`、`completeHouse`。基线各定义 1 次；当前 `index.html` 各定义 0 次，`js/house.js` 各定义 1 次。`house.js` 只引用一次，实际加载顺序为 `draw.js → house.js → 主内联 script`。31 个静态 house `onclick`、完整 DOMContentLoaded 初始化块及末尾音频解锁脚本与基线一致。

## 3. 极简小屋完整流程

在干净会话中实际进入小屋选择页和极简小屋，分别点击 `classic`、`treehouse`、`igloo`；切换 `sunset`、`night`、`forest` 背景与 `calm`、`happy`、`sad`、`anxious`、`warm` 五种情绪。九个装饰 `plant`、`book`、`candle`、`tea`、`cloud`、`star`、`cat`、`flower`、`rainbow` 均实际添加和取消；skin、outfit 与代码拼写为 `acces` 的 access 选项均切换。各步 `STATE.houseState`、`selected` class 与 SVG 预览一致，情绪切换的 `SoundFX.setMood` 行为一致。

点击 `completeHouse` 后结果、安慰语和专业解读显示，解读实际展开／收起。实际点击“保存贴纸并返回”后进入 `page-home`；当前旅程中新增 `🏡` 小屋贴纸。刷新后 `soul_journey` 原始文本与已保存状态、贴纸和预览恢复一致。退出、确认返回和再次进入流程实际通过。对三个基底分别比较拆分前基线与当前版的安慰语、解读和 SVG，结果相同；既有值映射问题未因迁移改变。

## 4. 其他四个模块与公共入口烟雾测试

氛围小屋实际选素材、完成搭建并显示结果；图像联想／绘画投射实际开始、填写三个答案、完成并保存贴纸；放走坏心情实际输入、提交、完成漂流瓶流程并保存贴纸；此刻心意实际回答 10 题、显示结果并保存。旅程实际新建、重命名、删除；设置面板实际打开、切换音效、关闭，`sound_enabled` 由 `true`→`false`→`true` 与 UI 一致。

首次对仍在动画中的页面过早点击未推进流程；等待动画结束后重测均通过，属于测试时序而非产品 FAIL。氛围结果虽显示，`atmosphereState.done` 仍为 `false`；拆分前和当前代码均无对该字段的写入，列为既有状态行为。

## 5. XSS 与存储：真实输入并刷新

三个 payload 各在独立干净会话中通过放走坏心情的真实用户输入流程写入、保存、刷新、重新进入。下表中计数依次为**输入前 / 输入后 / 刷新后**；`STATE` 指实际 `worryState.fragments[0].text`，存储指解析 `localStorage.soul_journey` 后的同一字段。

| Payload | script 数 | `img[onerror]` 数 | alert 次数 | STATE、存储原值与 DOM `textContent` |
|---|---|---|---|---|
| `<script>alert(1)</script>` | 13 / 13 / 13 | 0 / 0 / 0 | 0 / 0 / 0 | 输入后、刷新后均为原始 `<script>alert(1)</script>` |
| `<img src=x onerror=alert(1)>` | 13 / 13 / 13 | 0 / 0 / 0 | 0 / 0 / 0 | 输入后、刷新后均为原始 `<img src=x onerror=alert(1)>` |
| `javascript:alert(1)` | 13 / 13 / 13 | 0 / 0 / 0 | 0 / 0 / 0 | 输入后、刷新后均为原始 `javascript:alert(1)` |

每个 payload 的 STATE、localStorage 解析值、DOM 普通文字内容逐字相等；localStorage 保存原始文本，DOM 未新增可执行节点，刷新后仍安全，没有双重转义。三次流程均无资源或运行时产品错误。

## 6. 七个实际视口

每个视口实际设置为表列宽高并进入 `page-house`；`innerWidth`、`document.documentElement.clientWidth`、`scrollWidth` 与 `body.scrollWidth` 均由浏览器读取。plant/cloud 是最左／最右装饰提示框边界；数值单位 px。小屋 SVG 已生成，关键按钮实际可点击。七个视口均无水平滚动条，提示文字完整（提示框内容的 `scrollWidth≤clientWidth`、`scrollHeight≤clientHeight`）。

| 实际视口与 `innerWidth×innerHeight` | html client/scroll | body scroll | 溢出 | plant 左→右，宽×高 | cloud 左→右，宽×高 | SVG 宽×高 |
|---|---|---:|---:|---|---|---|
| 320×844 | 320 / 320 | 320 | 0 | 2→122，120×38 | 2→122，120×38 | 248×186 |
| 360×844 | 360 / 360 | 360 | 0 | 2→122，120×38 | 2→122，120×38 | 288×216 |
| 390×844 | 390 / 390 | 390 | 0 | 2→122，120×38 | 262.8→382.8，120×38 | 318×238.5 |
| 414×844 | 414 / 414 | 414 | 0 | 2→122，120×38 | 282→402，120×38 | 342×256.5 |
| 480×844 | 480 / 480 | 480 | 0 | 2→122，120×38 | 279.3→399.3，120×38 | 408×280 |
| 768×844 | 762 / 762 | 762 | 0 | 32.5→173.5，141×23 | 273.4→425.4，152×23 | 608×280 |
| 1366×768 | 1360 / 1360 | 1360 | 0 | 331.5→472.5，141×23 | 572.4→724.4，152×23 | 608×280 |

320–480px 的 `scrollWidth===clientWidth`，原 390px 的 9px 溢出已消失；九个装饰提示框均在视口内。768/1366px 的提示框计算宽、高、换行和对齐样式与 `a0a0c50` 桌面基线一致。桌面端 `innerWidth` 比 `clientWidth` 多 6px 是竖向滚动条占宽，不是水平溢出。

## 7. 资源与运行时

干净当前版会话实际请求：`favicon.svg` **HTTP 200，`image/svg+xml`**；`js/house.js` **HTTP 200，`text/javascript`**；11 个 CSS **HTTP 200，`text/css`**；14 个 WAV **HTTP 200，`audio/wav`**。浏览器不再请求 `/favicon.ico`；其他资源无 4xx/5xx。产品 `console.error=0`、`pageerror=0`、`unhandledrejection=0`、`ReferenceError=0`、资源加载错误=0。

双版本及较早会话的 `a0a0c50` 曾有默认 `/favicon.ico` 404；另一次测试服务器失联产生 `ERR_CONNECTION_REFUSED`。它们不是本次干净当前版的产品错误，不计入当前版结果。所有测试替身仅存在于测试会话，未写入产品文件。

## 8. 结论与清理

**FAIL=0；BLOCKED=0。** 04C-4 极简小屋机械拆分可以正式关闭产品级验收。**KNOWN_ISSUE：** `treehouse` / `igloo` 与部分 `tree` / `dome` 映射不一致；氛围结果可见而 `atmosphereState.done` 未被写为 `true`。两项都已确认在拆分前代码存在，本次未修复。

测试服务器停止、系统临时目录中的基线／脚本／截图／数据已清理。该次 04C-4 验收结束时 Git HEAD 为 `2fb8a7e`，工作区和未跟踪文件列表均为空；这是历史阶段状态，不是当前 HEAD。

## 9. 04C-5 氛围小屋机械拆分验收（实际执行）

以 `0eeb114` 为拆分前基线，核对 `ATMOSPHERE_ASSETS`、`ATMOS_TAB_NAMES`、`atmosCurrentTab`、`atmosDragItem`、`atmosDragOffset`、`atmosCanvasScale`、`atmosPinching`、`ATMOS_MOOD_TIPS` 8 个顶层值，以及 21 个函数。基线各定义 1 次；当前 `index.html` 各定义 0 次，`js/atmosphere.js` 各定义 1 次，源码与相对顺序一致。静态和动态 `onclick`、navigation 与 DOMContentLoaded 的 `initAtmosphere()` 入口、相邻公共代码及音频解锁 script 均未改变。

基线版和当前版实际执行进入／退出／再次进入、五个素材标签、背景和基底、家具／摆件／人物增删、鼠标拖拽与四角缩放、Touch 拖拽／双指缩放／touchcancel、Wheel 0.5～2 倍缩放、画布取消选择、Canvas 图片处理与平均色采样、五阶段完成动画、安慰语、解读折叠、贴纸保存、刷新及其他模块烟雾测试。当前版与基线行为一致，FAIL=0、BLOCKED=0。`atmosphereState` 不持久化、`done` 不写入、再次进入清空家具和人物、监听器与定时器清理风险均作为既有行为保留。

## 10. 04C-6 此刻心意机械拆分验收（实际执行）

以 `793f3d5` 为拆分前基线，核对 `CHOICE_QUESTION_POOL`、`CHOICE_QUESTIONS_COUNT` 2 个常量及 10 个函数。基线各定义 1 次；当前 `index.html` 各定义 0 次，`js/choice.js` 各定义 1 次，源码和顺序一致。`choice.js` 只加载一次，静态／动态 `onclick`、navigation 与 DOMContentLoaded 的 `initChoicePage()` 入口、相邻公共代码和音频解锁 script 均未改变。

两版使用相同随机源实际完成首次进入、开始流程、十题左右选择、进度条与回答数组、中途退出、刷新恢复、“继续上次选择”、结果、安慰语、专业解读、折叠、贴纸保存、完成后再次进入、退出弹窗、其他模块烟雾及资源检查。`STATE.choiceState` 与 `soul_journey` 格式保持一致，FAIL=0、BLOCKED=0。

## 11. 04D 全产品完整流程（实际执行）

在 Windows、Chrome 153、全新浏览器 profile 和清空后的 localStorage 中，以本地干净 `71078ef` 实际完成：演示登录；新建“04D旅程”；重命名为“04D完整旅程”；依次完成极简小屋、氛围小屋、图像联想、放走坏心情、此刻心意十题，并将五张贴纸保存到同一旅程。五类贴纸为：

- `🏡 情绪小屋·温暖`
- `🌅 氛围小屋·情绪空间`
- `🎨 绘画投射`
- `🌊 释放·漂流瓶`
- `☁️ 云朵·情绪需求`

实际删除一张贴纸后剩余 4 张；刷新后旅程、贴纸、house、draw、choice 状态恢复，`atmosphereState` 按既有行为恢复为空。音效关闭／刷新／开启／刷新均保持预期；退出弹窗取消与确认、删除旅程取消与确认均通过。最后重新创建“04D重建旅程”，应用仍可继续使用，未发现模块间状态串扰。

刷新前 `localStorage` 包含登录演示 keys 与 `soul_journey`。刷新后 `soul_journey` 仍只含 `archives`、`houseState`、`drawState`、`worryState`、`choiceState`；`currentJourneyId` 和 `atmosphereState` 不持久化，与代码事实一致。

## 12. 04D XSS、存储与刷新实际数值

三个 payload 各在独立干净会话中通过真实放走坏心情输入流程完成写入、DOM 显示、localStorage、刷新和再次显示：

| Payload | script 输入前／后／刷新后 | `img[onerror]` | alert | STATE 与 localStorage | DOM `textContent` | 双重转义 |
|---|---:|---:|---:|---|---|---|
| `<script>alert(1)</script>` | 15 / 15 / 15 | 0 / 0 / 0 | 0 / 0 / 0 | 原始 payload | 原始 payload 普通文字 | 否 |
| `<img src=x onerror=alert(1)>` | 15 / 15 / 15 | 0 / 0 / 0 | 0 / 0 / 0 | 原始 payload | 原始 payload 普通文字 | 否 |
| `javascript:alert(1)` | 15 / 15 / 15 | 0 / 0 / 0 | 0 / 0 / 0 | 原始 payload | 原始 payload 普通文字 | 否 |

15 个 script 节点来自 13 个外部脚本和 2 个内联脚本。刷新后没有新增可执行节点，localStorage 保存原始文本，HTML 显示层只做一次安全转义。

## 13. 04D 七个实际视口

下表均为浏览器实际设置并读取的值。768 和 1366 视口中 `innerWidth` 比 `clientWidth` 多 6px 是竖向滚动条占宽；每行 `scrollWidth === clientWidth`，横向溢出为 0。

| 视口与 innerWidth×innerHeight | clientWidth | scrollWidth | 溢出 | plant tooltip 左→右 | cloud tooltip 左→右 | 小屋 SVG | 氛围画布 |
|---|---:|---:|---:|---|---|---|---|
| 320×844 | 320 | 320 | 0 | 2→122 | 2→122 | 248×186 | 256×192 |
| 360×844 | 360 | 360 | 0 | 2→122 | 2→122 | 288×216 | 296×222 |
| 390×844 | 390 | 390 | 0 | 2→122 | 262.8→382.8 | 318×238.5 | 326×244.5 |
| 414×844 | 414 | 414 | 0 | 2→122 | 282→402 | 342×256.5 | 350×262.5 |
| 480×844 | 480 | 480 | 0 | 2→122 | 279.3→399.3 | 408×280 | 416×312 |
| 768×844 | 762 | 762 | 0 | 32.5→173.5 | 273.4→425.4 | 608×280 | 616×462 |
| 1366×768 | 1360 | 1360 | 0 | 331.5→472.5 | 572.4→724.4 | 608×280 | 402×301.5 |

每个视口实际遍历登录页、首页、旅程、五个模块、设置面板、退出弹窗和各模块结果区。关键按钮可见并可点击，文本、结果、画布、SVG 和弹窗未裁切；移动端未复现 house tooltip 的 9px 横向溢出。

## 14. 04D 资源、运行时与测试边界

- 13 个 JS、11 个 CSS、14 个 WAV：全部 HTTP 200。
- `favicon.svg`：HTTP 200，`image/svg+xml`；`/favicon.ico` 请求数为 0。
- 36 个 atmosphere 素材及流程使用的其他页面图片成功加载。
- HTTP 4xx/5xx=0，网络加载失败=0。
- `console.error=0`、`pageerror=0`、`unhandledrejection=0`。
- 04D 产品测试 FAIL=0、BLOCKED=0。

用户流程通过真实页面点击、输入、刷新、鼠标交互和实际视口设置执行。原生 `prompt` / `confirm`、XSS alert 计数及浏览器音频自动播放策略使用受控测试替身；替身只存在于测试浏览器内存，不代替模块核心用户流程，也未写入产品文件。音效开关和刷新持久化仍通过真实产品交互验证。

测试结束后服务器、浏览器测试 profile、脚本、报告和数据均从系统临时目录清理；项目工作区保持干净。远程分支同步是 Git 部署操作状态，不属于产品测试结果，也不计入 FAIL/BLOCKED。

## 15. 当前结论与未来测试

04C-5、04C-6 和 04D 均为本轮实际执行；04C-4 及更早阶段保留为历史验收记录。04D 本地最终整合验收结论为 **FAIL=0、BLOCKED=0**。AI Gateway、Safety Guard、真实服务端认证、数据库、生产环境部署和真实 AI 内容效果测试尚未执行，不能从当前结果推断其质量或上线状态。
