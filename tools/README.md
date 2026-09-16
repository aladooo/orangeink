# tools/ · 独立检测器

本目录原本放置橙墨自检器的命令行形态（`probe.py` / `verify.js`）。开源定稿时已按「独立项目」拆出，迁至独立仓库：

## [aladooo/wechat-article-checker](https://github.com/aladooo/wechat-article-checker)

**公众号文章结构合规检测器**——橙墨内置自检器的命令行版，可脱离本工具单独运行：

- `probe.py`（Python）—— official / real 双口径行高叠字检测（official 复刻官方算法预测弹窗，real 按行顶归并判断真叠字），规则对照见其 `docs/rules.md`；
- `verify.js`（Node）—— 同规则的 JS 版校验。

与主仓**互不依赖**：主仓的自检器见 [docs/self-check.md](../docs/self-check.md)，规则依据与实现细节两边共享，代码各自维护。
