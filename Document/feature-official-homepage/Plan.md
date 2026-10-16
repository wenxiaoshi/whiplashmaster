# 官网实现计划

```yaml
Target Branch: feature/official-homepage
Worktree Path: /Users/wenshy/Desktop/WhiplashTeacher/Code-Website
Base Branch: master
Owner: codex-01a146da-9d60-7562-94f8-785062938198
```

本次是独立 Code-Website Git 仓库，不涉及 KMM 工作树、构建或 Session Lock。仓库初始干净，无远端，无其他 worktree；在其专用功能分支实施。验收以 Spec.md 为准。

初始主分支名为 `main`；按用户合并要求统一为 `master`，分支重命名保留原提交历史。2026-10-17 合并前补充范围为移除 RSS、暂留 iOS 内测联系入口、准备 Pages 发布；不调整其他视觉样式。

## 文件结构与任务

| 任务 | 文件 | 职责 / AC | 验证 |
|---|---|---|---|
| 1 | `hugo.toml`, `data/{features,android,releases-audit}.json`, `static/img/screenshots/*`, `static/downloads/*.apk` | 集中配置、真实功能素材、发布记录依据、可用 APK；AC3/4/5 | 逐个核对原图哈希，读取 APK 元信息和 SHA-256 |
| 2 | `layouts/_default/baseof.html`, `layouts/partials/{head,header,footer,carousel,feature}.html`, `layouts/index.html`, `assets/css/main.css`, `assets/js/site.js` | 共享外观与渐进增强轮播；AC1/3 | Hugo 构建、轮播状态与计时测试、浏览器查看四图 |
| 3 | `layouts/features/{list,single}.html`, `content/features/{_index,companion,free-play,history}.md`, `layouts/changelog/{list,single}.html`, `content/changelog/v2.1.0.md`, `layouts/download/list.html` | 独立真实内容页面与安装入口；AC2/4/5 | 直达各路由、页面标题/高亮、APK 下载和 TestFlight HTTP 核验 |
| 4 | `layouts/_default/{list,single}.html`, `layouts/{feedback,roadmap}/list.html`, `layouts/_markup/{render-link,render-image}.html`, `content/about/_index.md`, `content/about/manual.md`, `content/changelog/*.md`, `archetypes/changelog.md` | 兼容旧内容，去除失效下载与已过期的首页版本说明；依据实际 Git 标签修正旧骨架的历史日期与未经证实说明；AC4/7 | 全站内部路径和资源扫描、发布记录与标签日期校对 |
| 5 | `scripts/check_site.py`, `tests/site.test.cjs`, `.github/workflows/hugo.yml`, `README.md`, `Document/feature-official-homepage/{Spec,Plan,review}.md` | 构建回归、CI 与维护交付；AC6/7 | 根路径和 `/whiplashmaster-site/` 路径分别构建并检查、Node 测试、浏览器窄屏与交互验证 |

任务按 1→2→3→4→5 执行。模板依赖数据，页面依赖共享外观，检查在页面和资源完成后执行；发现缺陷时先修复再重新运行相应检查。按已授权的视觉实现持续执行，不另设设计审批。

## 一致性检查

- AC 覆盖：7/7，对应任务见表。
- File 闭包：涉及的代码、数据、内容、素材、校验和文档均在表中登记。
- 命名一致：导航使用 `/features/`、`/changelog/`、`/download/`；功能 ID 为 scored / companion / free-play / history。
- 依赖闭环：数据→共享模板→页面→兼容→检查。
- 占位符：正式下载来源已找到；不可用的原 GitHub URL 不进入配置。

提交前进行代码、意图与 UX 检查；只提交本分支变更。生产发布留待远端与域名确认。
