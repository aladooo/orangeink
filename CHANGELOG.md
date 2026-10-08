# Changelog

版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)，格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

## [1.2.3] - 2026-10-09

### Fixed

- **parity-check.mjs 移除作者本机硬编码路径**：模板解析改为三级回退——argv 显式指定 → 同仓检出 `../../index.html` → 从 `raw.githubusercontent.com/aladooo/orangeink/main/index.html` 拉取（缓存系统临时目录 1 小时）；独立安装（用户级 skill 目录、无仓库检出）也能直接跑对拍
- **skill 包内 vendor 换未压缩发行版**：`markdown-it.min.js` → `markdown-it.js`（14.3.2 未压缩 dist，MIT）——消除 ClawHub 安全审计的 `suspicious.obfuscated_code`（Warn，压缩 JS 误伤混淆启发式）

### Added

- **package.json 声明 jsdom 依赖**（`^29.1.1`）：换机部署后 `npm install` 一步到位，不再需要手动 `npm install jsdom`

## [1.2.2] - 2026-10-09

### Fixed

- **长 URL 链接横向溢出**：链接文字本身是完整 URL 时（无空格长串，如 `https://github.com/aladooo/orangeink/tree/main/orangeink`），窄容器（手机 375px 模拟实测）内无断行点会横向溢出出界——`link_open` 渲染时对「链接文字=URL」的链接追加 `word-break:break-all`（浏览器版 + CLI 同口径；普通文字链接不受影响）

## [1.2.1] - 2026-10-08

### Fixed

- **linkify 全角污染（坏链）**：linkify-it 会把紧贴 URL 的全角标点连同后续汉字一起吸进自动链接（`https://…orangeink，装到用户级目录` → href 变 `…orangeink%EF%BC%8C…`，链接文字带中文，点开即坏链）——新增 core 规则 `oimd_linkify_cjk`：解码后「链接文字 === href」才认定自动链接，在第一个非 ASCII 字符处截断 href 与链接文字，余文还原为普通文本；手写 `[]()` 链接（含中文路径）不受影响
- **CLI 自检补盲区**：`render.mjs` 静态自检缺「加粗/斜体未生效（裸星号）」规则（此前只在浏览器版）——同一篇稿子浏览器拦 2 项、CLI 报 0 项；已按浏览器版同口径移植（2.1），code/pre 内星号不误报

### Added

- **自检器新增「代码内含链接」**（浏览器版 + CLI 2.2）：行内代码含完整 URL 时提示——微信编辑器会把代码里的 URL 自动转成可点链接、破坏代码样式，且长代码不可断行会引发公众号默认两端对齐的整行拉伸；改法：命令放代码样式、URL 移到代码外

[1.2.3]: https://github.com/aladooo/orangeink/releases/tag/v1.2.3
[1.2.2]: https://github.com/aladooo/orangeink/releases/tag/v1.2.2
[1.2.1]: https://github.com/aladooo/orangeink/releases/tag/v1.2.1
[1.2.0]: https://github.com/aladooo/orangeink/releases/tag/v1.2.0

## [1.2.0] - 2026-09-30

### Added

- **内置 Agent Skill（oimd）**：`orangeink/` 子目录（monorepo 式，随主仓同版本演进）——把任意 agent（WorkBuddy / OpenClaw / Claude Skills 兼容平台）接上即可把 Markdown 一键转成可直接发布微信公众号的三件套：纯净合规 HTML（API 用）/ 一键复制页（自带二次微调栏：主题 / 字号 / 边距 / 深色 / 手机预览）/ 公众号草稿箱 API 请求体 JSON，输出自带静态合规自检
- **headless 渲染器** `orangeink/scripts/render.mjs`：主排版台管线的函数级移植（span leaf 包裹 / px 行高 / font-family 剔除 / li section 包裹全保留）
- **对拍护栏** `orangeink/scripts/parity-check.mjs`：jsdom 执行浏览器版原脚本与 CLI 逐字节比对，默认对拍同仓 `index.html`——模板改动即改即验（验收：sample + 07~20 期 14 篇真文逐字节一致）
- `references/`（写作规范 / 合规坑位表 / 草稿箱 API 对接）与 `tests/`（全语法测试稿 + 复制页微调栏 jsdom 测试 20 项）

[1.1.0]: https://github.com/aladooo/orangeink/releases/tag/v1.1.0

## [1.1.0] - 2026-09-27

### Added

- **版本检查与升级提示**：加载 3s 后静默请求官网 `orangeink/version.json`——官方地址 base64 混淆存储、检查时解码，跳转目标再做**域白名单硬校验**（JSON 给的 URL 不以官方域开头就丢弃）；有新版本时页脚版本号旁出现亮橙「⬆ 新版本」徽标，悬停显示新版变化，点击新标签直达官网下载页。离线（`navigator.onLine=false`）、请求超时/失败、版本号格式非法一律静默，不影响离线使用

### Fixed

- **列表项加粗开头 → 后续文字强制换行**：微信粘贴解析会把 `<li>` 顶层行内兄弟节点拆开重组（`<li><strong>标签</strong><span>：文字</span></li>` → 加粗留顶层、余下被拆进块级 `<section>` 强制换行；第 19 期发布实测一条 6 项列表中招 4 项）——`polish()` 在 `wrapTextRuns` 之前先跑 `wrapLiSections()`，把纯行内内容的 li 整包进单个 `<section>`，对齐官方 `li > section` 结构（`docs/wechat-compat.md` 坑 10）

[1.0.1]: https://github.com/aladooo/orangeink/releases/tag/v1.0.1

## [1.0.1] - 2026-09-19

### Added

- **自检器新增「加粗/斜体未生效」检测**：CommonMark 分隔符「左右翼」规则下，`**` 紧贴中文标点（引号 / 书名号 / 「」 / 句号）会开/收失败，正文残留裸星号——自检面板直接报出位置与改法；`code` / `pre` 代码块内星号不误报
- **页面页脚**：品牌名 + 版本号 + MIT 开源声明 + GitHub 更新入口——单文件被转发后，用户仍可溯源到最新版
- **`<head>` 元信息**：author（AladoooWu）/ license（MIT）/ canonical / Open Graph（og:image 指向仓库实拍图），单文件被转发分享时保留署名与协议、社交平台显示信息卡

### Changed

- 默认示例改为「中登行走中 · 第 08 期 · 现成的排版工具一堆，我为什么还要自己造」（保留全部语法演示模块）

## [1.0.0] - 2026-09-16

首个开源版本。以下能力均在 2026-09-15/16 的内部开发期完成，并经真实公众号发布流程反复实测回灌（详见各 docs 文档与 `docs/wechat-compat.md` 的踩坑手册）。

### Added

- **结构合规自检器**：对微信「结构异常」检测的前端实现，official / real 双口径行高叠字检测 + font-family 白名单 + WCAG AA 对比度 + 空标签 / 无单位行高 / 复制污染等历史坑位检查（`docs/self-check.md`）
- **一键复制**：`copy` 事件自建剪贴板 HTML + 净化链路，粘贴公众号零「结构异常」弹窗
- **四套主题**：橙墨 · 炭黑×亮橙（默认）/ 墨蓝×朱砂 / 松烟×陶土 / 石墨×鎏金；主题 = `THEMES` 注册表里的一个 JS 对象，工具栏下拉切换、选择持久化（`docs/theming.md`）
- **四个结构化模块**：`:::intro` 栏目开场 / `:::quote` 金句卡 / `:::steps` 步骤清单 / `:::point` 观点卡
- **GFM 提示块**：`> [!NOTE]` 等五种 emoji 警告块渲染为中文徽章提示块
- **被动脚注**：`[^id]` 语法自动渲染「正文上标 + 文末参考块」（公众号不支持锚点跳转的合规替代）；无脚注的文章零影响
- 双预览（手机 375 / 安全区 677）+ 深色模式模拟（只影响预览，不进复制内容）
- 编辑器 ⇄ 预览同步滚动（百分比映射 + 回声锁）
- 双口径字数统计（源文字数 / 公众号口径正文字数）
- 草稿自动保存（localStorage）
- 单文件构建：`python src/build.py` 内联 markdown-it 14，产出根目录 `index.html`，零依赖完全离线

### Fixed

以下均为真实发布中踩到的实弹坑，修复思路沉淀在 `docs/wechat-compat.md`：

- 段内含加粗即被官方检测误判「行高叠字」——所有直接文本节点包裹 `<span leaf>` 规避矩形计数误判
- 一键复制后公众号报「结构异常」（双根因）——弃用 `execCommand` 选区复制，改 `copy` 事件自建 HTML + 净化
- 分割线粘贴后消失——微信解析剥空标签，条内塞 `&nbsp;` 保基线
- 引用块多行被合并——引用块内按行渲染 `<br>`（嵌套按深度计数）
- 提示块「下松上紧」——清零容器最后一个子元素的 margin-bottom
- 对比度 9 项不达 WCAG AA（自检 11 → 0 项）——徽章改白字并加深底色等系统性修复

[1.0.0]: https://github.com/aladooo/orangeink/releases/tag/v1.0.0
