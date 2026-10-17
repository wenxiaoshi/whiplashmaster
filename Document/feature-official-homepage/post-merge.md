# 官网合并复盘

日期：2026-10-17。

## 合并结果

- 仓库：独立的 `Code-Website`。
- 原主分支 `main` 重命名为 `master`；起点为 `069e54f`。
- `feature/official-homepage` → `master` 已执行 `--ff-only` 合并，无冲突；实现提交 `3c05de5`，合并前修正提交 `d46f24e`。
- 合并范围 72 个文件，新增 1342 行、删除 2183 行；包含已审核官网实现、资源、回归检查和交付文档。
- 合并后 `master` 包含功能分支的全部提交，生产代码与已验证的构建源一致；没有远端，未推送或触发线上发布。

## 技术经验

| 问题 | 原因 | 本次处理 |
|---|---|---|
| 点击 RSS 显示 XML | 浏览器直接打开订阅源；用户决定暂时撤下该功能 | 同时移除 UI、内容提示和 Hugo 输出，清理旧构建后扫描确认没有遗留源或自动发现链接 |
| iOS 邀请待维护者补充 | 已有链接不代表维护者确认的正式入口 | 将 `iosURL` 留空，提供申请内测联系入口；配置邀请后自动切换按钮与安装说明 |
| 项目站点部署在子路径 | Hugo 对模板路径和菜单 URL 的处理不同 | 模板站内路径去除前导斜线后使用 `relURL`；菜单使用 Hugo 已生成的 `.URL`，避免重复子路径 |
| 四张 App 截图比例不同 | 真实页面包括竖屏和横向热力图 | 原图字节保持不变，通过固定展示框和 `object-fit: contain` 保持完整内容与切换稳定 |

## 文档与资产同步

Spec、Plan、review、README 及 GitHub Pages 发布清单已同步最新用户决定。网站结构和维护方法记录于 README，不涉及 App PRD/SA、平台适配或原生工程。既有 KMM Rules、Skills、Wiki 不需变更；本次经验仅保存在项目文档中。

## 验证与后续

11 项轮播测试和 JS 语法检查通过；根路径与 GitHub Pages 子路径的 28 个 HTML 页面、内部链接、资源、APK 及截图哈希检查通过；工作流 YAML、差异格式检查通过。浏览器已确认 RSS 入口消失及 iOS 申请内测入口有效呈现。截图见 `evidence/rss-removed.jpg`。

后续需确认官网专用 GitHub 仓库地址，配置 Pages 为 GitHub Actions，再推送 `master`。TestFlight 邀请链接等待维护者补充，不阻塞 Android 官网发布。操作步骤见 `github-release.md`。

## GitHub 发布跟进 · 2026-10-17

维护者指定 `wenxiaoshi/whiplashmaster`，并明确确认将其从 Private 改为 Public 后继续发布。本地 `origin` 和 Hugo `baseURL` 已对齐，实际 `/whiplashmaster/` 子路径构建的 28 个 HTML 页面检查通过。配置提交 `12e8b5f`、`441207e` 已快进合并至 `master` 并推送；远端默认分支已设为 `master`，原 `main` 初始化提交保留。

Pages 已启用 GitHub Actions。首轮 run `38984894837` 的云端测试、构建与资源完整性检查全部通过，部署被旧 `main` 环境分支策略阻止；已将该策略同步为仅允许 `master`，并重新运行失败任务。技术经验已加入 `github-release.md`，不修改全局 Memory 或 App 工程治理资产。

修正后构建、部署均成功，官网已在 `https://wenxiaoshi.github.io/whiplashmaster/` 上线。线上浏览器验收通过：共享样式和四张真实截图全部加载，版本记录没有 RSS，下载页面提供 Android APK 和待补充 TestFlight 的申请内测入口。发布证据见 `evidence/published-home.jpg` 和 `evidence/pages-actions.jpg`。
