# WhiplashMaster · 官网

> 「鼓手最严格的老师」的官方网站，用于版本发布、功能介绍、Roadmap 公示与用户反馈收集。

**在线地址**：<https://whiplashmaster.github.io/>（部署后生效）

---

## 目录导览

```
Code-Website/
├── hugo.toml                # Hugo 全局配置（品牌色、菜单、外链、Tally ID 等）
├── archetypes/              # 新内容模板
├── assets/css/main.css      # 极客风主题 CSS（882 行 · 深浅色 + 品牌橙 #FF6D00）
├── content/                 # 所有页面内容（Markdown）
│   ├── _index.md            # 首页元数据
│   ├── features/            # 功能介绍
│   ├── download/            # 下载页
│   ├── changelog/           # 14 个版本更新日志
│   ├── roadmap/             # Roadmap 三档看板
│   ├── feedback/            # 反馈页
│   └── about/               # 关于 / 隐私政策 / 使用手册
├── layouts/                 # 自写 layouts（不依赖第三方主题）
│   ├── _default/            # baseof / list / single
│   ├── partials/            # head / header / footer
│   ├── changelog/           # 更新日志专属 layout
│   ├── download/            # 下载页 tab 布局
│   ├── feedback/            # 反馈页
│   ├── roadmap/             # Roadmap 看板
│   └── index.html           # 首页
├── static/                  # 静态资源
│   ├── img/                 # logo 等
│   ├── assets/              # 微信二维码
│   └── js/theme.js          # 主题切换 + 移动菜单 + 下载 tab 逻辑
└── .github/workflows/hugo.yml   # GitHub Pages 自动部署
```

---

## 本地开发

### 依赖

- **Hugo Extended v0.128.0+**（macOS：`brew install hugo`）
- **Git**

### 启动预览

```bash
cd Code-Website
hugo server -D    # -D 显示 draft
# 打开 http://localhost:1313
```

### 构建静态站点

```bash
hugo --gc --minify --baseURL "/"
# 产物在 public/
```

---

## 常见任务 SOP

### 1. 发布新版本 changelog

发布 App 新版本后，跟随以下步骤同步官网：

#### Step 1：新建 changelog 页

```bash
hugo new changelog/v2.0.2.md
```

或直接复制 [content/changelog/v2.0.1.md](content/changelog/v2.0.1.md) 修改。

frontmatter 约定：

```yaml
---
title: "v2.0.2"
version: "v2.0.2"
date: 2026-08-15         # 发布日期
channel: "release"       # release / beta
versionCode: 16          # Android versionCode
summary: "一句话摘要（首页会展示）"
highlights:              # 3~5 个亮点，首页 / 列表页展示
  - "🐛 xxx"
  - "✨ xxx"
tags: ["bugfix", "feature", "major"]   # 选填
apkURL: ""               # 选填，不填则按约定构造：
                         # https://github.com/{owner}/{repo}/releases/download/{version}/WhiplashMaster-{version}-KMM-release.apk
iosNote: ""              # 选填，iOS 端说明（TestFlight / App Store）
---

## 正文...
```

#### Step 2：更新首页最新版本

修改 [hugo.toml](hugo.toml) `[params]`：

```toml
latestVersion = "v2.0.2"
latestVersionDate = "2026-08-15"
```

#### Step 3：把 APK 传到 GitHub Releases

```bash
# 项目仓库操作（不是官网仓库）
git tag v2.0.2
git push origin v2.0.2

# 在 GitHub 网页端创建 Release，上传 APK 附件：
# 安装包/WhiplashMaster-v2.0.2-KMM-release.apk
```

APK 命名必须严格按 `WhiplashMaster-{version}-KMM-release.apk` 约定，否则下载页链接失效。

#### Step 4：commit + push

```bash
git add content/changelog/v2.0.2.md hugo.toml
git commit -m "chore(changelog): release v2.0.2"
git push
```

GitHub Actions 会在 2-3 分钟内自动部署到 GitHub Pages。

---

### 2. 调整 Roadmap

编辑 [content/roadmap/_index.md](content/roadmap/_index.md) 的三档数组：

```yaml
planned:       # 规划中
  - title: "xxx"
    desc: "xxx"
in_progress:   # 开发中
beta:          # 内测中
```

按发布节奏定期迁移条目（planned → in_progress → beta → changelog）。

---

### 3. 更新反馈渠道

#### 配置 Tally 表单

1. 到 <https://tally.so/> 免费创建一份反馈表单
2. 拷贝表单 ID（形如 `mYourFormId`，从表单 URL 提取）
3. 修改 [hugo.toml](hugo.toml)：

```toml
tallyFormId = "mYourFormId"   # 替换为你的真实 ID
```

未配置时，反馈页会降级为「微信 / 小红书」两个渠道 + 提示文字。

#### 替换微信 / 小红书

- 微信二维码：替换 [static/assets/wechat-qr.jpg](static/assets/wechat-qr.jpg)
- 小红书链接：修改 [hugo.toml](hugo.toml) `xiaohongshu` 字段

---

### 4. 自定义域名

若购买了独立域名（如 `whiplashmaster.com`）：

1. 在域名 DNS 添加 CNAME 记录指向 `whiplashmaster.github.io`
2. 在 `static/` 目录创建 `CNAME` 文件，内容为 `whiplashmaster.com`
3. 修改 [hugo.toml](hugo.toml)：

```toml
baseURL = "https://whiplashmaster.com/"
```

4. push 后 GitHub Pages 设置页会自动识别 CNAME

---

## 部署

### GitHub Pages（推荐）

已通过 [.github/workflows/hugo.yml](.github/workflows/hugo.yml) 自动化：

- 推送 `main` / `master` 分支 → 触发 Actions
- Hugo 构建 → 上传到 Pages artifact → 部署

**首次配置**：仓库 Settings → Pages → Source → **GitHub Actions**

### 手工部署到其他平台

```bash
hugo --gc --minify --baseURL "https://your-domain.com/"
# 把 public/ 目录上传到任意静态托管（Vercel / Netlify / OSS）
```

---

## 设计规范

- **品牌色**：`#FF6D00`（活力橙，与 App `OrangeThemePrimary` 对齐）
- **字体**：
  - 正文：`-apple-system` 系统字体优先 + `Inter`
  - 版本号 / 元数据：`JetBrains Mono` / `SF Mono`
- **深浅色**：`data-theme` 属性切换 + `prefers-color-scheme` 回退，localStorage 记忆用户选择
- **响应式断点**：`900px` / `640px`

---

## 贡献

- Bug / 建议 → 直接改 Markdown 提 PR
- 视觉调整 → 修 [assets/css/main.css](assets/css/main.css)
- 结构调整 → 修 [layouts/](layouts/) 目录

---

## License

内容 CC BY-NC 4.0 · 代码 MIT
