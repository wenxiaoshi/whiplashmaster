# Android 官网 ZIP 下载

日期：2026-10-18（Asia/Kuala_Lumpur）。分支：`bugfix/android-zip-download`。开工提交：`47695dd`；工作树干净，fetch 后 master 与 origin/master 相同。

用户要求：官网 Android 直接下载 APK 被拦截，改用安装包根目录中已准备好的 2.2.0 ZIP，以后官网均发布 ZIP。用户明确补充：“官网暂无figma 文件，运行一段时间之后再生成figma”。本次按此指示暂缓官网 Figma。

## 实现及审查

- 使用用户提供的 `安装包/WhiplashMaster-v2.2.0-KMM-release.apk.zip`，不重新打包。ZIP 为 12,751,940 字节，SHA-256 `e4a774ddb745099eb740d6fcabca081ec52961519fd8c8e1d1427157e95322c6`。
- 内含根目录 APK 为 32,993,535 字节，SHA-256 `19b430bd05437ec9defda79cc9ef7d0dc1bfa8acfee3ce1d51e1dcae8798aee4`，与安装包归档和原官网 APK 一致。保留用户 ZIP 原有的 macOS 元数据；校验器明确兼容该条目。
- `data/android.json` 顶层描述 ZIP，嵌套 `apk` 描述原 APK；官网下载地址与 download 文件名均改为 ZIP。移除官网当前版本原始 APK，保留本地归档和官网已有历史文件。
- 下载模板显示“ZIP 压缩包”、ZIP 大小和解压步骤；版本、App 日期、iOS 安装入口沿用现状。Spec AC5 与 README 同步更新。
- `scripts/check_site.py` 在原有 Pages 上传前检查中强制验证 ZIP 及内层 APK 的大小、哈希、CRC、唯一根目录 APK 和版本文件名；拒绝直接 APK、APK 改后缀、错误版本及错误按钮目标。Pages 新增 Python 回归测试步骤，README 记录以后压 ZIP 的操作。
- `.gitignore` 忽略 Python 测试产生的 `__pycache__/`。未修改 App 构建、签名、平台或算法代码，不重新构建 App，不递增 App 版本，不新建 Release Note 或 tag。

审阅人：Codex。根因依据是用户反馈的 APK 直接下载拦截；本次验证下载容器替换和内容完整性，没有在用户受影响设备上复现拦截器或验证安装效果。全部修改对应本任务，未发现关联 App 配置变化。

## 验证

- Hugo 生产构建及 29 个 HTML 页面、内部链接、资源、原始截图、ZIP 和内层 APK 完整性检查通过。
- 11 项现有轮播测试和 6 项 ZIP 发布门禁回归测试通过；回归覆盖用户提供的 macOS ZIP、直接 APK、APK 改后缀、错误/多个 APK、内层哈希错误和损坏 ZIP。
- 浏览器实际展开 Android 安装说明，确认 ZIP 下载目标、12.2 MB 大小及四步安装流程；页面沿用原有排版与原生 details 交互。截图：`download-local.png`。
- App 视觉门禁实际执行 `visual_sync_gate.py check`，退出码 0，结果见 `visual-check.json`。生产候选文件数为 0，codeDigest 为 `44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a`。这仅表明未修改 App 来源，不代表官网已同步在线 Figma。

发布后以 GitHub Pages 工作流结果和线上 ZIP 下载完整性核对为准。
