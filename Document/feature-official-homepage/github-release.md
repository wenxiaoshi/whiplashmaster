# GitHub Pages 发布清单

日期：2026-10-17。官网代码仓库：`Code-Website`，主分支：`master`。

## 本地准备

- 使用独立官网仓库，原 `main` 主分支统一为 `master`，保留提交历史。
- Pages 工作流只监听 `master`，也支持手动触发；构建前运行轮播测试，上传前校验页面、链接、APK 与截图完整性。
- RSS 功能暂时关闭，不生成订阅输出，也不显示订阅入口。
- TestFlight 邀请链接暂时留空，下载页显示“申请内测”；维护者提供链接后填写 `hugo.toml` 中 `[params.downloads].iosURL`。
- Android v2.1.0 APK 已包含在静态资源中。

## 连接并发布

1. 官网专用仓库已确认为 `https://github.com/wenxiaoshi/whiplashmaster`，本地 `origin` 已配置。2026-10-17 浏览器确认原远端仅有 `main` 上的一次初始化 README 提交（`6445fc9`）；该分支继续保留。
2. 使用拥有该仓库权限及 `workflow` scope 的 `wenxiaoshi` GitHub CLI 登录，在 `Code-Website` 中推送本地 `master`，保留远端既有 `main` 初始化提交，并将 GitHub 仓库默认分支设为 `master`。
3. 仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。
4. 如首次推送早于 Pages 配置，在 Actions 中手动运行 **Deploy Hugo site to Pages**。
5. 检查 build、deploy 均通过；工作流采用 GitHub Pages 返回的 `base_url`，支持仓库子路径。`hugo.toml` 的 `baseURL` 也应更新为最终站点地址，供本地生产构建使用。
6. 打开工作流给出的站点 URL，检查首页、独立功能页、版本记录、Android 下载及 iOS 联系入口。

站点目标地址为 `https://wenxiaoshi.github.io/whiplashmaster/`。如使用独立域名，以实际 Pages 地址为准。

## 当前启用条件

初始在维护者已登录的 Chrome 中，Pages 设置页面显示 **Upgrade or make this repository public to enable Pages**，因此没有 Build and deployment / Source。维护者随后明确确认“改为 Public，继续发布官网”，已据此将官网专用仓库公开。

本机 GitHub CLI 的 `wenxiaoshi` 现有登录已验证有效，拥有仓库管理和 workflow 权限；受限网络下的初次登录检查误报凭据失效。发布时临时选择该账户凭据，不更改其他项目的默认登录，不读取浏览器会话、不创建新 Token，也不强制覆盖远端初始分支。

## 首次发布配置 · 2026-10-17

仓库已公开，官网 `master` 已推送并成为默认分支。Pages 的 `build_type` 为 `workflow`，浏览器中 Source 显示 **GitHub Actions**。

首次云端构建和全部校验通过，但部署被环境策略阻止：启用 Pages 时默认分支仍是 `main`，`github-pages` 环境自动生成的部署分支策略因此只允许 `main`。已将原策略修改为仅允许 `master`，保留环境分支限制，再重跑失败的部署任务。后续若重命名主分支，也要同步检查 Settings → Environments → github-pages 的部署分支策略。

修正后 [首次发布工作流](https://github.com/wenxiaoshi/whiplashmaster/actions/runs/38984894837) 构建与部署均成功，`441207e` 已上线到 [正式官网](https://wenxiaoshi.github.io/whiplashmaster/)。浏览器确认首页、四张原图、版本记录及下载页面加载正常，RSS 入口已移除，iOS 仍显示“申请内测”。线上首页和 Pages 来源配置截图分别见 `evidence/published-home.jpg`、`evidence/pages-actions.jpg`。

## 后续维护

以后通过功能分支完成修改和检查，再合并到 `master`；推送 `master` 会触发发布。版本与安装包更新方法见根目录 README。TestFlight 链接是后续待补配置，不阻塞 Android 官网发布。
