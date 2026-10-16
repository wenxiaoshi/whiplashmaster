# GitHub Pages 发布清单

日期：2026-10-17。官网代码仓库：`Code-Website`，主分支：`master`。

## 本地准备

- 使用独立官网仓库，原 `main` 主分支统一为 `master`，保留提交历史。
- Pages 工作流只监听 `master`，也支持手动触发；构建前运行轮播测试，上传前校验页面、链接、APK 与截图完整性。
- RSS 功能暂时关闭，不生成订阅输出，也不显示订阅入口。
- TestFlight 邀请链接暂时留空，下载页显示“申请内测”；维护者提供链接后填写 `hugo.toml` 中 `[params.downloads].iosURL`。
- Android v2.1.0 APK 已包含在静态资源中。

## 连接并发布

1. 确认官网专用 GitHub 仓库的完整地址。不要使用个人博客仓库。当前本地没有 `origin`，未执行远端推送。
2. 在 `Code-Website` 中将该地址添加为 `origin`，推送本地 `master`，并将 GitHub 仓库默认分支设为 `master`。
3. 仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。
4. 如首次推送早于 Pages 配置，在 Actions 中手动运行 **Deploy Hugo site to Pages**。
5. 检查 build、deploy 均通过；工作流采用 GitHub Pages 返回的 `base_url`，支持仓库子路径。`hugo.toml` 的 `baseURL` 也应更新为最终站点地址，供本地生产构建使用。
6. 打开工作流给出的站点 URL，检查首页、独立功能页、版本记录、Android 下载及 iOS 联系入口。

当前配置中的 `https://wenxiaoshi.github.io/whiplashmaster-site/` 仅为预期地址，不表示对应远端已创建或站点已发布。若采用其他仓库或独立域名，以实际 Pages 地址为准。

## 后续维护

以后通过功能分支完成修改和检查，再合并到 `master`；推送 `master` 会触发发布。版本与安装包更新方法见根目录 README。TestFlight 链接是后续待补配置，不阻塞 Android 官网发布。
