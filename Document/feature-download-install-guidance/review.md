# 下载页安装说明调整

日期：2026-10-17。分支：`feature/download-install-guidance`。

用户要求：Android 安装说明隐藏 SHA-256 及其值；iOS 无法安装时可通过微信联系开发者，微信号 `Wenshy_2048`。

## 实现与验收

| 要求 | 实现 | 验证 |
|---|---|---|
| Android 不显示 SHA-256 | 从模板输出中移除标签和哈希值，折叠标题改为“安装说明” | 生产 HTML 不含 SHA-256 或实际哈希；浏览器展开后只有安装步骤 |
| iOS 安装失败联系 | 已配置和未配置邀请的安装说明均显示微信联系方式 | 当前 TestFlight 分支展开后显示完整微信号，邀请地址保持正确 |
| 保持下载可用 | 不改 APK、下载元数据、邀请链接、CSS 或 JS | 28 个 HTML 页面、内部资源和 APK 完整性检查通过 |

代码及意图审查：全部修改对应上述要求，Spec 的 AC5 已同步；仅涉及独立 Hugo 网站，不影响 App 平台或生产源码。APK 的 SHA-256 数据仍供构建完整性校验使用。

UX：IA 通过（安装步骤仍在原折叠区）；Visual 通过（沿用现有样式）；Copy 通过（明确说明安装失败和微信号）；Interaction 通过（两个折叠区正常展开）；A11y 通过（真实文本可选择，原生 summary）；Empty/Error 通过（邀请缺省时同样有联系方式）；Space 通过（窄屏自然换行，完整微信号可见）。本地浏览器证据为 `download-local.jpg`。

## App 视觉门禁适用性

依据当前 `Document/app-visual-interaction/WORKFLOW_GATE.md`，开工前保存 `visual-start.json`，合并前实际运行 `visual_sync_gate.py check`：退出码 0，状态 PASS，源码摘要 `44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a`，收据输出为 `visual-check.json`。该脚本覆盖 App 生产候选文件，本仓库为独立 Hugo 网站，候选数为 0；官网可见变更通过浏览器单独验收，不据此声称官网已同步到 App Figma 稿。

本次不改 App PRD/SA、Rules、Skills、Wiki 或全局 Memory。通过功能分支快进合并到 `master`，推送后由现有 Pages 工作流构建并部署，线上再次展开两端安装说明验收。
