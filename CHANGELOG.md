# Changelog

版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)，格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

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
