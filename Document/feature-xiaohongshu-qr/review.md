# 小红书二维码入口

日期：2026-10-17。分支：`feature/xiaohongshu-qr`。

用户提供原始二维码 JPG，要求官网小红书路径使用该二维码。

- `static/assets/xiaohongshu-qr.jpg` 为原图逐字节复制，尺寸 987×1347，SHA-256 为 `e39b3c31af631b9986d593f2af16941475f68f65390837cd276d295c9dfa20ac`；未裁切、重绘、改色或重新编码。
- 联系页的小红书卡片展示原图，提供扫码/保存识别说明，点击图片可在新标签查看原图；保留完整白边、头像、昵称和小红书号。
- 关于页的小红书入口跳转到 `/feedback/#xiaohongshu`；移除不再使用的旧外链配置，避免入口指向不同账号。
- 生产构建 28 个 HTML 页面、内部链接、锚点、原图资源和 APK 完整性检查通过；站点 `/whiplashmaster/` 子路径正确。浏览器确认原图加载和比例正常，证据见 `feedback-local.jpg`。扫码识别未做手机实扫，不把页面加载验证视为扫码成功。
- UX：信息位置、样式、文案、原生图片链接、替代文本及窄屏布局通过；无新异步交互或加载状态。代码与意图审查通过，改动均对应用户要求，不涉及 App 源码或其他下载逻辑。

按当前工作区规范保存开工基线 `visual-start.json` 并实际运行 App 视觉门禁 check：退出码 0、PASS，输出见 `visual-check.json`，codeDigest 为 `44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a`。本仓库不含 App 候选源，网页自身采用浏览器验收，不声称已同步到 App Figma 稿。合并后经验保存在本项目，不改 App PRD/SA、Rules、Skills、Wiki 或全局 Memory。
