# 官网开发验收与审查

日期：2026-10-17。分支：`feature/official-homepage`。基线：`main` / `069e54f`。审阅范围仅 Code-Website；App、个人博客及原始附件未修改。

## 意图与 AC 覆盖

| AC | 结果 | 证据 |
|---|---|---|
| AC1 视觉 | √ | 红黑主题、放大品牌/下载按钮、无菜单与已删除标语、四项介绍在图片外上方；evidence/home-1.jpg 至 home-4.jpg |
| AC2 独立页面 | √ | /features/、companion/、free-play/、history/、/changelog/、/download/；浏览器逐项导航与直接刷新正常 |
| AC3 轮播 | √ | 浏览器实测约 3 秒间隔：01→02→03→04→01；键盘选择与焦点均到 home-tab-1；桌面四图框均 (260,308,760,480)，390px 四图框均 (20,384,350,500) |
| AC4 真实记录 | √ | 14 个版本日期依据真实标签；data/releases-audit.json 记录 commit 与日期；旧占位摘要改为标签/提交可支持的事实 |
| AC5 安装 | √ | 浏览器实际下载 APK（33,366,222 字节），SHA-256 与 data/android.json 相等；aapt 显示 2.1.0/16、minSdk 29；apksigner 校验通过。TestFlight HTTP 200，页面显示 Whiplash Master 邀请；未加入内测，名额未确认 |
| AC6 验证 | √ | 11 项 Node 行为测试；根路径与 /whiplashmaster-site/ 两种生产构建；各 28 个 HTML 页面链接、资源、ID、原图与 APK 校验通过 |
| AC7 维护 | √ | 既有手册/隐私/历史路径可访问；README、changelog archetype、配置/数据、CI 检查已补齐 |

## 代码审查

- Hugo 模板共享，不维护一套重复的静态视觉稿页面；功能数据、安装元信息、发布依据集中存放。
- 首页 carousel 渐进增强，只有一个计时器；手动操作重置周期，后台停止，pageshow 恢复，支持减少动态效果偏好。错误图片给出可操作的功能页入口。
- 四张 App 截图 SHA-256 与用户提供的原图一致，使用 contain；没有裁切、拉伸、改色或补画截图内容。
- GitHub Pages 子路径检查发现并修复根路径跳出及菜单路径重复前缀；菜单使用 Hugo 已解析 URL，静态内容和 Markdown 路径按 baseURL 处理。
- 不再构造 404 的 GitHub Release 链接。Android 同站静态文件下载；TestFlight 使用已存在的项目邀请。
- CSS / JS 经 Hugo 压缩、指纹与 SRI 输出；无第三方脚本、外部字体、运行时包依赖、新增网站统计或账户。
- 所有渲染页面一个 H1；tab/tabpanel 对应、键盘漫游焦点、图片 alt、暂停控制和跳转主内容入口均具备。
- KMM 编译、DSP/expect-actual 检查：N，本次不改 App。GitHub 云端 Actions：尚未运行，仓库无远端。

## 执行过的检查

```sh
node --test tests/site.test.cjs
node --check assets/js/site.js
hugo --gc --cleanDestinationDir --minify --baseURL http://127.0.0.1:4174/ --destination /private/tmp/whiplash-official-build
python3 scripts/check_site.py /private/tmp/whiplash-official-build --base-url http://127.0.0.1:4174/
hugo --gc --cleanDestinationDir --minify --baseURL https://example.invalid/whiplashmaster-site/ --destination /private/tmp/whiplash-official-subpath
python3 scripts/check_site.py /private/tmp/whiplash-official-subpath --base-url https://example.invalid/whiplashmaster-site/
git diff --check
```

浏览器在 390px 和 320px 下检查首页、功能、练习记录、下载、版本列表与手册：scrollWidth 等于 viewport，没有横向溢出。桌面与手机证据位于 evidence/。未执行 Lighthouse、真机系统字号缩放或真机安装；本次 APK 检查为元信息/签名/下载完整性。

## UX 逐项审查

依据 review-ux 的 P1（变化边界固定）与 P2（降低判断和操作成本）。N 表示原生 App 项或本次无相应交互；Web 用途按已批准视觉与浏览器行为审查，不把 Android dp / Compose 色板冒充为网站规则。

### IA 信息架构

| 项 | 状态 | 证据 / 适用性 |
|---|---|---|
| IA-01 | √ | 页面 H1 与内容一致 |
| IA-02 | √ | 主导航到独立页，分类仅一层 |
| IA-03 | √ | 文章回到全部版本，品牌回首页 |
| IA-04 | √ | 顶部主 CTA 为下载；平台卡各一个安装路径 |
| IA-05 | √ | 次要信息在页脚或安装说明 |
| IA-06 | √ | 列表空态与图片失败入口 |
| IA-07 | √ | 品牌、列表返回与相邻版本链接 |
| IA-08 | N | 没有删除或覆盖用户数据的操作 |
| IA-09 | √ | 主页内容独立，不用滚动锚点冒充导航 |
| IA-10 | √ | 3 个导航加下载；无额外菜单 |

### Visual 视觉

| 项 | 状态 | 证据 / 适用性 |
|---|---|---|
| V-01 | √ | 按用户决定网站红黑，原图保持 App 原色 |
| V-02 | √ | 共享 CSS 字号与层级 |
| V-03 | N | 原生 8dp token 不适用；Web 使用共享间距 |
| V-04 | √ | 截图、卡片和按钮圆角一致 |
| V-05 | √ | 仅截图展示框使用统一轻阴影 |
| V-06 | N | 未引入图标系统 |
| V-07 | N | 用户批准单一深色主题；版本记录暖白区域单独验证 |
| V-08 | √ | 真实判定图例完整保留 |
| V-09 | N | 本次无新节奏音符绘制 |
| V-10 | N | 网站不重绘评分环 |
| V-11 | √ | 热力图完全保留原图 |
| V-12 | √ | 波形完全保留原图 |

### Copy 文案

| 项 | 状态 | 证据 / 适用性 |
|---|---|---|
| C-01 | √ | 中文为主、减少营销文案 |
| C-02 | √ | 评分/陪伴/自由演奏用词一致 |
| C-03 | √ | 去除 mock 标记与占位下载 |
| C-04 | √ | 日期与版本数据集中，核对标签日期 |
| C-05 | √ | 图片失败引导功能页；邀请失败引导反馈 |
| C-06 | √ | 下载、加入、暂停、继续均为动词 |
| C-07 | √ | 列表空态包含当前版本入口 |
| C-08 | N | 没有耗时任务提示文案 |
| C-09 | N | 无新增三连音表示 |
| C-10 | N | 没有 Toast/Snackbar |

### Interaction 交互

| 项 | 状态 | 证据 / 适用性 |
|---|---|---|
| I-01 | √ | 选中态、hover、可见 focus outline |
| I-02 | N | 无站内异步工作任务 |
| I-03 | N | 无滑动手势或拖拽 |
| I-04 | N | 无输入表单 |
| I-05 | N | 无数据写入操作；页面链接保留浏览器默认语义 |
| I-06 | N | 无软键盘输入 |
| I-07 | √ | 图片加载失败可进入功能页 |
| I-08 | √ | 轮播下划线/ARIA/计数同步 |
| I-09 | N | 网站不请求原生权限 |
| I-10 | √ | 后台暂停计时，前台保持选择恢复 |

### A11y 无障碍

| 项 | 状态 | 证据 / 适用性 |
|---|---|---|
| A-01 | N | 原生 48dp 不适用；Web 主要控件不低于 44px，功能 tab 更高 |
| A-02 | √ | 共享页面文字对比度；红色按钮使用 19px/700 大字 |
| A-03 | √ | tab 关系、截图 alt、主导航/相关信息标签 |
| A-04 | √ | 减少动态效果默认暂停，可显式继续 |
| A-05 | N | 未执行真机系统字号缩放；浏览器默认缩放正常 |
| A-06 | √ | 选中状态同时使用文字、计数、下划线与 ARIA |

### Empty / Error / Loading

| 项 | 状态 | 证据 / 适用性 |
|---|---|---|
| E-01 | √ | 列表空态有入口 |
| E-02 | √ | 截图失败提供功能页，内测联系入口可见 |
| E-03 | N | 静态 SSR，无接口 loading；图片尺寸预留 |
| E-04 | N | 用户未要求网站统计或错误上报 |

### Space 空间稳定性

| 项 | 状态 | 证据 / 适用性 |
|---|---|---|
| S-01 | √ | 4 组截图框坐标逐项测量一致 |
| S-02 | √ | 图片比例不同不推动顶部 |
| S-03 | √ | contain 留边吸收源图比例差异 |
| S-04 | N | 没有原生吸底操作面板 |
| S-05 | √ | 截图内按钮仅为真实图像，不伪装额外网页动作 |
| S-06 | √ | 轮播统一 show/restart 状态入口 |
| S-07 | N | 无表单校验 |
| S-08 | √ | 暂停与后台状态不重置当前选择 |
| S-09 | √ | 每张图全幅显示，图例与底部完成按钮完整 |
| S-10 | √ | 测试双向断言一个可见面板，其余隐藏 |

## 结论

代码、意图与 UX 范围检查通过，无本次实现阻塞项。维护入口与构建方法已在 README 提供。生产发布尚未执行：需为独立官网指定远端仓库与最终域名 / Pages 路径，不能覆盖个人博客。
