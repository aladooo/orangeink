# 主题开发指南

> 一个主题 = `THEMES` 注册表里的**一个 JS 对象**。本文讲清接口、键位含义与配色方法论；每套主题的完整设计稿见 [design/](design/)。

## 注册接口

`src/template.html` 中：

```js
var THEMES = {
  zhongdeng: {
    name: '中登 · 炭黑×亮橙（默认）',  // 工具栏下拉里的中文显示名
    C: { /* 色板，见下表 */ },
    alerts: {  // 五色 GFM 提示块，值 = [块底色, 左条色]
      NOTE:      ['#fff3e7', '#ff5a00'],
      TIP:       ['#f9f3ea', '#8c5a2b'],
      IMPORTANT: ['#ffeee8', '#c93600'],
      WARNING:   ['#fff5e0', '#e08a00'],
      CAUTION:   ['#fdeeea', '#cf3b2a'],
    },
  },
  // inkblue / pine / gold ...
};
```

切换机制：工具栏下拉改 `OPT.theme` → `applyOpts()` 重指 `var C = THEMES[OPT.theme].C` → 重建样式表 `buildS()` 并重渲染 `render()`。选择持久化在 localStorage，主题键名必须过白名单校验（未知键回退默认主题）。

## 色板键位

| 键 | 用途 |
|----|------|
| `ORANGE` | accent 主色：条、点、分割条。**只做装饰，永远不做正文文字色**（硬性规则） |
| `DEEP` | 大标题 / 表头 / 观点卡标题 |
| `EMBER` | H3 / 行内代码文字 / 引用文字 |
| `STRONG` | **加粗文字色**（需对白底与各浅底都过 AA） |
| `CHIP` | 徽章 / 步骤序号白字底（配白字 ≥4.5:1） |
| `LINK` | 链接色（含下划线分隔色） |
| `BROWN` / `TAN` | H4 等小标题 / 落款等暖色层级 |
| `TEXT` / `TEXT2` | 正文 / 题注与斜体 |
| `TXTQ` | pre 块 / 步骤说明等次级正文 |
| `WARMBG` / `WARMBG2` / `CODEBG` | 提示块等模块底 / pre 底 / 行内 code 底 |
| `ZEBRA` | 表格斑马纹 |
| `LIST2` | 二级列表圆点色 |
| `BORDER` | 表格框线 |
| `PTEYE` / `PTNOTE` | 观点卡 eyebrow / note 点缀色（深色卡上的弱化层） |

## 硬性规则（过不了就不收）

1. **所有文字色相对其实际所在背景 ≥ WCAG AA（4.5:1）**，大字号 ≥3:1。注意同一文字色可能出现在白底、模块底、斑马纹多种背景上，逐个背景算；
2. **accent（`ORANGE`）只做装饰**。高饱和橙做正文文字色是可读性灾难——橙墨默认主题的设计逻辑是「靠黑白反差提神，高饱和色只做 hazard-accent」；
3. **徽章底色与白字 ≥4.5:1**（徽章一律白字，见 [wechat-compat.md](wechat-compat.md) 第 8 条）；
4. **不新增 font-family**（平台白名单限制，见 compat 手册第 2 条——所以主题没有字体选项，只有颜色）。

## 配色方法论

橙墨默认主题（中登 · 炭黑×亮橙）的设计思路，供新主题参考：

- **黑白反差提神**：正文与标题用近黑深色（`#26221c` / `#1c1917`），靠字重、字号与深浅分层制造节奏，而不是靠彩色；
- **高饱和 accent 降级为信号**：亮橙只出现在分隔条、列表圆点、序号、上标这些「位置信号」上——读者扫读时靠它定位，阅读时不被干扰；
- **暖色层级克制**：H3/H4、落款等用低饱和暖棕（`#c94a00` / `#8c5a2b` / `#8a663a`）拉开层级，与 accent 同族但不同饱和度；
- **浅暖模块底承载提示块**：五色提示块用同族的浅暖底（默认主题 `#fff3e7`～`#ffeee8` 一族），靠**徽章与左条颜色**区分类型——底色统一可以让嵌套与并排不花，类型差异交给 accent 信号层表达。

## 提交新主题的流程

1. 在 `src/template.html` 的 `THEMES` 里仿写一个新条目；
2. `python src/build.py` 重建 `index.html`；
3. 浏览器打开，粘贴一篇覆盖全要素的测试文（标题、加粗、链接、表格、列表、提示块、模块、脚注），逐项确认颜色落位；
4. 点「自检」跑到 **0 项**（对比度检查会替你兜底）；
5. 提 PR：附色板表 + 对比度计算过程 + 手机 375 视图截图。详见 [CONTRIBUTING](../CONTRIBUTING.md)。

## 设计稿

每套主题配一份自包含 HTML 设计页（离线可开，含完整色板、样张与对比度说明）：

- [design/theme-zhongdeng.html](design/theme-zhongdeng.html) — 中登 · 炭黑×亮橙（默认）
- [design/theme-inkblue.html](design/theme-inkblue.html) — 墨蓝×朱砂
- [design/theme-pine.html](design/theme-pine.html) — 松烟×陶土
- [design/theme-gold.html](design/theme-gold.html) — 石墨×鎏金

选型建议见 [design/themes-overview.md](design/themes-overview.md)。
