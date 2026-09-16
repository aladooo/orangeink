# orangeink · 橙墨 — 公众号 Markdown 排版台

<p align="center">
  <b>单文件 · 离线 · 把「结构合规」内置进渲染管线的公众号排版工具</b>
</p>

<p align="center">
<a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License"></a>
<a href="https://github.com/aladooo/orangeink/pulls"><img src="https://img.shields.io/badge/PRs-welcome-blue" alt="PRs welcome"></a>
<img src="https://img.shields.io/badge/build-none-lightgrey" alt="no build needed">
<img src="https://img.shields.io/badge/dependencies-0-brightgreen" alt="zero runtime deps">
</p>

**orangeink（橙墨）** 是一个单文件 HTML 工具：左边写 Markdown，右边实时预览公众号真实观感，一键复制带内联样式的正文直接粘贴进公众号编辑器。

它与其他 Markdown→微信工具最大的不同，是把**公众号平台的结构合规检查做成了内置自检器**——粘贴进公众号之前，「行高叠字」「font-family 违规」「对比度不足」这类会弹「结构异常」警告的问题，就已经在编辑器里被预演和拦截过了。

<!-- TODO: 放置真机实拍图（公众号发布效果，3 张关键屏）
<p align="center"><img src="example/demo-preview-1.png" width="280"><img src="example/demo-preview-2.png" width="280"><img src="example/demo-preview-3.png" width="280"></p>
<p align="center"><sub>公众号发布后的真机实拍（非渲染截图）</sub></p>
-->

## ✨ Features

- 🩺 **结构合规自检器**：内置对微信「结构异常」检测的前端实现（含官方矩形计数口径与真实行数双口径），发布前预演平台检查；附带 WCAG AA 对比度检查。详见 [docs/self-check.md](docs/self-check.md)
- 📋 **一键复制**：copy 事件里自建 HTML + 净化（strip 危险样式、行高折算 px、文本节点包裹），粘贴后零「结构异常」弹窗
- 🎨 **四套主题**：中登（炭黑×亮橙，默认）/ 墨蓝×朱砂 / 松烟×陶土 / 石墨×鎏金，一键切换、选择持久化；主题 = 一个 JS 对象，见 [docs/theming.md](docs/theming.md)
- 🧩 **四个结构化模块**：`:::intro` 栏目开场 / `:::quote` 金句卡 / `:::steps` 步骤清单 / `:::point` 观点卡
- 📝 **被动脚注**：`[^id]` 语法自动渲染成「正文上标 + 文末参考块」（公众号不支持锚点跳转的合规替代）
- 📱 **手机 375 / 安全区 677 双预览** + 深色模式模拟（智能反色，只影响预览不影响复制）
- 🔄 **编辑器 ⇄ 预览同步滚动**（百分比映射）
- 🔢 **双口径字数**：左侧「源文字数」（Markdown 源文）+ 右侧「正文字数」（贴近公众号统计口径）
- 💾 草稿自动保存（localStorage）· 引用块按行分行 · 上下留白对称等细节见 [docs/wechat-compat.md](docs/wechat-compat.md)

## 🚀 Quick Start

1. 下载 [`index.html`](https://aladooo.github.io/orangeink/)（或直接访问 GitHub Pages 预览）；
2. 双击打开——**零依赖、零构建、完全离线**；
3. 粘贴 Markdown → 点「一键复制到公众号」→ 到公众号编辑器粘贴。

> 所有处理都在你的浏览器本地完成，不上传任何内容。

## 📝 Writing Syntax

标准 Markdown 全支持（GFM 表格/删除线/任务列表）。橙墨扩展的语法：

````markdown
<!-- 结构化模块 -->
:::intro
eyebrow: 栏目名 · 第 08 期
title: 文章标题
subtitle: 一句话说明这篇写什么
meta: 2026.09.16 · 署名
:::

:::quote
text: 这里放一句能收住全文的判断
from: 出处（可删本行）
:::

:::steps[清单标题]
先做什么 | 说明这一步具体怎么做
再做什么 | 说明
:::

:::point
eyebrow: 本期观点
text: 一句话判断
note: 补充说明（可删本行）
:::

<!-- GFM 提示块（emoji 换中文徽章） -->
> [!NOTE]
> 说明 / [!TIP] 提示 / [!IMPORTANT] 重点 / [!WARNING] 注意 / [!CAUTION] 警告

<!-- 脚注 -->
正文提到某本书[^b1]。

[^b1]: 书名《…》（一句话注解）
````

完整示例见 [example/demo.md](example/demo.md)。

## 🎨 Themes

| 主题 | 气质 | 适用 |
|------|------|------|
| **中登 · 炭黑×亮橙**（默认） | 在场观察、克制提神 | 通用 · 经公众号连续实测回灌 |
| 墨蓝 × 朱砂 | 冷调证据感 | 深度评测 / 技术解读 |
| 松烟 × 陶土 | 慢内容、互补暖点缀 | 随笔 / 生活类 |
| 石墨 × 鎏金 | 商业感、强品牌记忆点 | 商业评论 / 年度复盘 |

工具栏「主题」下拉一键切换，选择自动记住。每套主题的完整色板、对比度数据与设计稿见 [docs/design/](docs/design/themes-overview.md)。

## 🩺 Self-Check

点「自检」对当前正文跑规则检查，全部通过才建议复制发布：

- **行高叠字检测**（官方 `verify-article-structure-spec` 的前端实现，official / real 双口径）
- **font-family 白名单**（官方仅允许 `mp-quote, PingFang SC, system-ui, -apple-system` 链）
- **WCAG AA 对比度**（文字 vs 所在背景 ≥4.5:1）
- 空标签（会被微信剥离）、无单位行高、复制污染等历史坑位检查

规则依据与实现细节：[docs/self-check.md](docs/self-check.md) · 独立校验脚本：[aladooo/wechat-article-checker](https://github.com/aladooo/wechat-article-checker)

## 📦 For Developers

```
src/template.html   源码模板（全部逻辑在此单文件）
src/build.py        构建脚本：注入 vendor，产出根目录 index.html
src/vendor/         markdown-it 14.x 单文件内联
tools/              独立检测器说明（见 wechat-article-checker 仓库）
```

本地构建：`python src/build.py`。修改主题/模块直接改 `src/template.html` 后重建。

## 🗺 Roadmap

见 [ROADMAP.md](ROADMAP.md)。已实现清单、计划中的方向（二批模块、图片能力、HTML 导入等），以及「欢迎 issue 提需求」的征集注脚。

## 🙏 Acknowledgments

- [doocs/md](https://github.com/doocs/md) — 同类工具的先行者，多处理念致敬
- [md2wechat](https://github.com/fe-one/md2wechat) — 「模块管结构、主题管气质」的分离思路
- [wechatjs/verify-article-structure-spec](https://github.com/wechatjs/verify-article-structure-spec) — 自检器规则依据
- [xiaohu-wechat-format](https://github.com/lyh2668/xiaohu-wechat-format) — 早期探索

## 🤝 Contributing

欢迎 issue 与 PR：提主题（附色板+对比度计算）、提模块（说清解决的阅读任务）、报兼容性坑（附复现 HTML）。见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 📄 License

[MIT](LICENSE)
