# Whiplash Master 官网

鼓手 App 的 Hugo 静态官网。红黑主题、四张真实 App 截图、独立功能子页面、版本记录、Android APK 直装与 iOS TestFlight 安装路径。

## 本地运行

需要 Hugo Extended 0.158.0、Node.js 22+ 和 Python 3.11+；没有 npm 依赖。

```sh
hugo server --baseURL http://localhost:1313/ --disableFastRender
```

浏览器打开终端提示的地址。普通生产构建：

```sh
hugo --gc --minify --baseURL https://your-site.example/
node --test tests/site.test.cjs
python3 scripts/check_site.py public --base-url https://your-site.example/
```

`public/` 是可直接部署的静态文件，包括 APK。`baseURL` 及上述检查必须使用最终部署地址；当前目标是 `https://wenxiaoshi.github.io/whiplashmaster/`。工作流也支持其他仓库子路径，不表示站点已上线。

## 页面结构

| 路径 | 内容 |
|---|---|
| `/` | 四项功能与真实截图，每 3 秒轮播 |
| `/features/` | 评分练习 |
| `/features/companion/` | 节拍陪伴 |
| `/features/free-play/` | 自由演奏 |
| `/features/history/` | 练习记录 |
| `/changelog/` | 版本记录列表；点击展开、进入完整说明 |
| `/changelog/v2.1.0/` | v2.1.0 发布说明 |
| `/download/` | Android APK 与 iOS TestFlight |
| `/about/manual/`、`/about/privacy/` | 使用手册、隐私政策 |

顶部导航是独立页面链接；首页四功能控件只切换截图，不滚动页面。屏幕变窄后导航常驻品牌栏下方，没有额外“菜单”。既有关于、反馈、Roadmap 及历史版本链接继续可访问。

## 内容与素材

- `data/features.json`：四项功能的标题、介绍、图片尺寸、替代文字和独立路径。
- `static/img/screenshots/`：用户提供的四张原图。保留原始比例与橙黑配色，通过 `object-fit: contain` 放进固定尺寸展示框；原图哈希与文件来源见 `sources.json`。不要把原图里的 UI、数字或颜色改写成网页的品牌色。
- `assets/css/main.css`：红黑视觉与响应式样式。
- `assets/js/site.js`：无依赖的轮播。支持键盘、手动选择、暂停/继续；后台停止计时，系统“减少动态效果”下默认暂停。截图加载失败时显示功能页入口。
- `content/changelog/`：版本说明 Markdown。14 个版本的日期依据 App 实际 Git 标签校对；摘要依据标签说明与相关提交整理，去除旧骨架中无法证实的量化宣称。标签与 commit 索引见 `data/releases-audit.json`。v2.1.0 对应 `d891798` / 2026-07-30。

## 更新版本与下载

1. 将已签名 APK 放入 `static/downloads/`。当前为 `WhiplashMaster-v2.1.0-KMM-release.apk`（33,366,222 字节，versionCode 16，最低 Android 10）。
2. 更新 `data/android.json` 的版本、日期、文件名、静态路径、字节数、最低系统与 SHA-256；校验脚本会核对构建产物。
3. 更新 `hugo.toml` 的 `latestVersion` 和 `latestVersionDate`。
4. 运行 `hugo new content changelog/vX.Y.Z.md`，填写真实日期、摘要与 highlights，完成审核后移除 `draft: true`。
5. 构建并执行上述两个检查命令。首页版本号应能进入相应发布说明。

下载页默认使用站内 APK。未来将安装包迁移至已验证的 GitHub Releases 或对象存储时，把 `[params.downloads].androidURL` 配置为真实完整 URL；本次没有使用旧官网会返回 404 的推测 Release 地址。当前 APK 仍随构建发布，校验脚本会检查它的大小和哈希。

`[params.downloads].iosURL` 当前留空，等待维护者补充正式 TestFlight 邀请链接。页面提供“申请内测”的反馈联系入口及对应安装说明；补充真实完整 URL 后，会自动显示“加入 TestFlight”。

RSS 尚未开放：版本记录页不显示订阅入口，Hugo 也不生成 RSS 输出。

## 部署

`.github/workflows/hugo.yml` 保留 GitHub Pages 工作流，加入轮播测试与构建检查。主分支统一为 `master`；推送 `master` 或手动触发后，Actions 会构建并发布 `public/`。正式使用前：

1. 为官网配置专用远端仓库，默认分支设为 `master`，避免覆盖个人博客。
2. 在目标仓库 Settings → Pages 选择 GitHub Actions。
3. 让 Actions 使用 Pages 返回的 `base_url`；使用独立域名时同步设置 `hugo.toml` 和 DNS。

官网专用远端为 `https://github.com/wenxiaoshi/whiplashmaster.git`。当前仓库为 Private，Pages 页面提示需升级套餐或改为公开才可启用；尚未推送官网代码或触发生产发布。具体发布准备见 [GitHub Pages 发布清单](Document/feature-official-homepage/github-release.md)。需求、实现与验收记录位于 `Document/feature-official-homepage/`。

内容 CC BY-NC 4.0 · 代码 MIT。
