# GitHub Pages 发布清单

日期：2026-10-17。官网代码仓库：`Code-Website`，主分支：`master`。

## 本地准备

- 使用独立官网仓库，原 `main` 主分支统一为 `master`，保留提交历史。
- Pages 工作流只监听 `master`，也支持手动触发；构建前运行轮播测试，上传前校验页面、链接、APK 与截图完整性。
- RSS 功能暂时关闭，不生成订阅输出，也不显示订阅入口。
- TestFlight 邀请链接暂时留空，下载页显示“申请内测”；维护者提供链接后填写 `hugo.toml` 中 `[params.downloads].iosURL`。
- Android v2.1.0 APK 已包含在静态资源中。

## 连接并发布

1. 官网专用仓库已确认为 `https://github.com/wenxiaoshi/whiplashmaster`，本地 `origin` 已配置。2026-10-17 浏览器确认远端为 Private，仅有 `main` 上的一次初始化 README 提交（`6445fc9`）；尚未推送本地官网代码。
2. 使用拥有该仓库权限及 `workflow` scope 的 `wenxiaoshi` GitHub CLI 登录，在 `Code-Website` 中推送本地 `master`，保留远端既有 `main` 初始化提交，并将 GitHub 仓库默认分支设为 `master`。
3. 仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。
4. 如首次推送早于 Pages 配置，在 Actions 中手动运行 **Deploy Hugo site to Pages**。
5. 检查 build、deploy 均通过；工作流采用 GitHub Pages 返回的 `base_url`，支持仓库子路径。`hugo.toml` 的 `baseURL` 也应更新为最终站点地址，供本地生产构建使用。
6. 打开工作流给出的站点 URL，检查首页、独立功能页、版本记录、Android 下载及 iOS 联系入口。

站点目标地址已改为 `https://wenxiaoshi.github.io/whiplashmaster/`，目前尚未上线。如使用独立域名，以实际 Pages 地址为准。

## 当前启用条件

初始在维护者已登录的 Chrome 中，Pages 设置页面显示 **Upgrade or make this repository public to enable Pages**，因此没有 Build and deployment / Source。维护者随后明确确认“改为 Public，继续发布官网”，已据此将官网专用仓库公开。

本机 GitHub CLI 的 `wenxiaoshi` 现有登录已验证有效，拥有仓库管理和 workflow 权限；受限网络下的初次登录检查误报凭据失效。发布时临时选择该账户凭据，不更改其他项目的默认登录，不读取浏览器会话、不创建新 Token，也不强制覆盖远端初始分支。

## 后续维护

以后通过功能分支完成修改和检查，再合并到 `master`；推送 `master` 会触发发布。版本与安装包更新方法见根目录 README。TestFlight 链接是后续待补配置，不阻塞 Android 官网发布。
