# 页脚联系入口

2026-10-17 · `feature/footer-feedback-link`

用户要求官网底部增加“联系与反馈”，方便查找现有小红书与微信二维码，其他保持不变。唯一生产修改为共用 `layouts/partials/footer.html` 新增指向 `/feedback/` 的链接；沿用站内子路径处理和现有页脚样式。

生产构建及 28 个 HTML 页面的资源/链接/APK 检查通过；额外逐页确认页脚仍含“使用手册”“隐私政策”，并新增正确的 `/whiplashmaster/feedback/` 入口。浏览器从首页页脚实际点击后进入二维码页面，窄屏入口可见；截图 `footer-local.jpg`。未修改其他页面内容、CSS、JS、图片或下载配置。代码及意图审查通过；UX 信息位置、视觉、文案、原生链接交互、可访问名称、已有加载状态及窄屏空间检查通过。

按当前工作区流程保存 `visual-start.json`，实际执行 App 视觉门禁 check，原始退出码 0、PASS，结果 `visual-check.json`，codeDigest `44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a`。该门禁覆盖 App 生产来源，本独立 Hugo 仓库候选数为 0；网页交互使用浏览器单独验收，不将此记录表述为官网已同步 App Figma 稿。本次经验归档到本项目，不涉及 App PRD/SA、Rules、Skills、Wiki 或全局 Memory。
