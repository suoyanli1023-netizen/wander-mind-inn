# 变更记录

按实际提交记录模块化阶段及独立质量修复；不设虚构版本号、发布日期或上线状态。

## `b7f1a44 04c4-house-extraction` — 极简小屋机械拆分

- 将模块注释和 10 个函数从 `index.html` 逐字迁至新文件 `js/house.js`，在 `js/draw.js` 后、主内联脚本前同步加载。
- 用户仍可选择房屋、背景、情绪、装饰和 DIY，完成解读并保存贴纸；本提交无意改变文案、视觉、动画、音效、STATE、localStorage 或交互。
- 与 `a0a0c50` 基线逐函数及完整流程比较一致；随后在 `2fb8a7e` 上完成 04C-4 最终回归，FAIL=0、BLOCKED=0。

## `7ad9cd2 fix-favicon-404` — 修复默认图标请求 404

- 在 `index.html` head 显式引用根目录静态 `favicon.svg`，图标延续绿色叶子／小屋意象。
- 浏览器不再发起导致 404 的默认 `/favicon.ico` 请求；`favicon.svg` 实测 HTTP 200、`image/svg+xml`。页面业务与布局无意改变。

## `2fb8a7e fix-house-mobile-tooltip-overflow` — 修复移动端装饰提示框溢出

- 仅在 `css/responsive.css` 既有 480px 以下媒体规则中，为 `#house-deco-grid .tooltip` 设置 120px 宽、允许换行并居中文本。
- 320、360、390、414、480px 小屋页实测横向溢出均为 0，提示文字完整；768/1366px 桌面样式与拆分前基线一致。没有裁切、隐藏提示框或改变摆件布局。

## `793f3d5 04c5-atmosphere-extraction` — 氛围小屋机械拆分

- 将 8 个顶层值、21 个函数及对应模块注释从 `index.html` 机械迁入 `js/atmosphere.js`，在 `house.js` 后同步加载。
- Mouse、Touch、Wheel、Canvas 图片处理、五阶段完成动画、结果、贴纸和再次进入流程均与 `0eeb114` 基线一致；双版本验收 FAIL=0、BLOCKED=0。
- 用户继续通过相同素材标签、画布和结果流程使用氛围小屋；本提交无意改变文案、视觉、状态格式、音效或既有非持久化行为。

## `71078ef 04c6-choice-extraction` — 此刻心意机械拆分

- 将 2 个常量、10 个函数和模块注释从 `index.html` 机械迁入 `js/choice.js`，在 `atmosphere.js` 后同步加载。
- 十题流程、中途退出、继续、刷新恢复、结果、解读、贴纸和随机题目行为与 `793f3d5` 基线一致；双版本验收 FAIL=0、BLOCKED=0。
- 用户可感知流程无意改变，`STATE.choiceState` 和 `soul_journey` 格式保持不变。

## 04D 最终整合验收 — 无产品代码提交

- 在本地干净 `71078ef` 上实际完成登录、旅程增删改、五模块闭环、同一旅程五类贴纸、刷新与存储、三个 XSS payload、七个视口、资源和运行时检查。
- 13 个 JS、11 个 CSS、14 个 WAV、favicon 和素材资源均加载成功；产品测试 FAIL=0、BLOCKED=0。
- 验收只读取产品代码，没有产品文件变更，也不代表生产发布。

## `docs-final-modularization-handoff` — 最终文档封版（本提交）

- 同步 `AGENTS.md`、`HANDOFF.md`、产品演进、测试证据和变更记录，使阶段状态与 `71078ef` 产品代码及 04D 本地验收一致。
- 该提交只包含文档，不改变产品行为。远程封版状态以本提交完成后的实际 push 结果为准。

## `a1d021d fix-house-base-value-mapping` — 极简小屋基底映射

- 将解读逻辑的旧 `tree` / `dome` 值改为真实输入 `treehouse` / `igloo`，三种基底均显示对应安慰语与专业解读。
- 未改变 HTML 选项、STATE、存储、SVG、文案、贴纸、导航或音效。

## `13406c4 fix-atmosphere-state-persistence` — 氛围场景持久化

- 将 `atmosphereState` 纳入 `soul_journey`，恢复背景、基底、家具、人物、位置、尺寸与完成状态；兼容旧数据、缺字段、错误数组类型和异常记录。
- 完成后保存 `done=true`，继续编辑后恢复为 `false`；再次进入保留场景且不重复生成元素。

## `d8b4edd fix-atmosphere-lifecycle-cleanup` — 氛围生命周期清理

- 撤销已删除或重建元素的交互监听器，防止画布监听重复，并在离开氛围页时清除临时监听和完成动画 timer。
- 正常五阶段动画、Mouse/Touch/Wheel、状态恢复、音效与贴纸流程保持原有体验；退出后不再产生迟到结果或音效。

## `bfeffb0 fix-atmosphere-mobile-default-placement` — 移动端默认元素完整可见

- 调整两个右侧默认模板，并仅对新添加元素按真实渲染尺寸夹取位置；已持久化位置和用户主动拖动位置不改写。
- 七个视口均实际添加 13 件家具、5 个摆件、4 个人物并再循环添加 13 件家具，共 35 个元素；全部位于画布内，横向溢出为 0。

## 05A 稳定性最终验收 — 无额外产品代码提交

- 在 `bfeffb0` 上重新完成五模块与五类贴纸、三种基底、氛围存储兼容、`done` 转换、10 次进出、20 次拖拽、3 次完成、四阶段动画退出、XSS、七视口、资源与运行时检查。
- 产品测试 FAIL=0、BLOCKED=0；该结论是本地及测试环境验收，不代表生产上线。

## `docs-05a-stability-handoff` — 05A 文档封版（本提交）

- 增量同步五份工程、产品、测试与变更文档；不修改产品代码。最终远程状态以普通 push 后的 Git 查询为准。

## 当前边界与后续方向

- GitHub/Google、微信和邮箱登录都是演示实现；API Key 只保存到本地，不发起 AI 请求。
- 当前没有真实 AI、Agent、Safety Guard、服务端 Gateway 或数据库。后续产品能力与服务端安全架构须独立授权。

具体测试方法、数值及历史／本次验收边界见 `docs/TESTING.md`。
