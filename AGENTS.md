# 项目状态

- 当前分支：feature/ai-product-v2
- 交接前最后一个产品代码基线：5602e81（04c3-draw-extraction）
- 实际当前 HEAD 必须在每次任务开始时通过 git rev-parse --short HEAD 获取，不得只依赖本文档
- 已完成至：04C-3 draw extraction
- 下一阶段：04C-4 house extraction
- 04C-4 尚未开始

# 修改规则

1. 开始前检查分支、HEAD、git status。
2. 如工作区存在无法解释的修改，立即停止。
3. 禁止使用 git reset --hard、git clean、git restore、git checkout --。
4. 不得覆盖或删除用户已有修改。
5. 每次只执行一个明确阶段。
6. 机械拆分期间不得优化、重写或改变函数逻辑。
7. 不修改产品文案、视觉、动画、音效和业务流程。
8. 不修改 STATE 字段和 localStorage 数据格式。
9. 保留普通同步 script，不使用 import/export。
10. 保留全局函数和所有 HTML onclick。
11. 不修改与当前任务无关的文件。
12. 已拆分并验证的文件默认禁止修改。
13. 测试脚本、基线和截图只能存放于系统临时目录。
14. 每次提交前执行机械一致性、功能、存储、XSS、控制台和资源测试。
15. 存在 FAIL 或 BLOCKED 时不得标记正式通过。
16. 未经用户确认不得创建提交或进入下一阶段。

# AI 产品边界

- 当前没有真实 AI 请求；
- 当前没有服务端 AI Gateway；
- 当前没有数据库；
- API Key 设置只是预留 UI；
- OAuth 不是生产级服务端认证；
- Safety Guard、Agent、心理内容库属于后续目标架构；
- 不得把目标架构描述为已实现。

# 04C-4 特别约束

- 只机械迁移极简小屋的 10 个函数；
- 新文件目标为 js/house.js；
- 只允许修改 index.html 和新增 js/house.js；
- 保留 DOMContentLoaded 中的恢复逻辑；
- 保留所有 house 相关 onclick；
- generateHouseSVG 必须逐字保持；
- 完成后必须与父提交执行逐函数比较；
- 未获得用户确认前不得开始实施。
