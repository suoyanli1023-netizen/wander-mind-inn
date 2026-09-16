# 变更记录

按实际提交记录 04C-4 及其独立质量修复；不设虚构版本号、发布日期或上线状态。

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

## 已知问题与下一阶段

- HTML／STATE 的 `treehouse`、`igloo` 与部分解读规则的 `tree`、`dome` 值不一致；属于拆分前已有行为，这些提交未修复。
- 氛围小屋结果可显示，但 `atmosphereState.done` 没有被写为 `true`，另记为既有状态行为。
- 下一阶段计划为 **04C-5 atmosphere extraction，尚未开始**。真实 AI、服务端认证和数据库也未实现。

具体测试方法、数值及历史／本次验收边界见 `docs/TESTING.md`。
