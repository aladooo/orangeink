# -*- coding: utf-8 -*-
"""构建橙墨（orangeink）单文件：把 vendor/markdown-it.min.js 注入 template.html 占位符。"""
import os, re

base = os.path.dirname(os.path.abspath(__file__))
vendor_path = os.path.join(base, 'vendor', 'markdown-it.min.js')
tpl_path = os.path.join(base, 'template.html')
out_path = os.path.join(base, '橙墨 · 公众号 Markdown 排版台.html')

with open(vendor_path, 'r', encoding='utf-8') as f:
    vendor = f.read()
with open(tpl_path, 'r', encoding='utf-8') as f:
    tpl = f.read()

# 防 </script> 字面提前闭合 script（markdown-it.min.js 实际不含，保险处理）
vendor_safe = vendor.replace('</script', '<\\/script')

# 替换占位行 /*__VENDOR_MARKDOWN_IT__*/ ... 为 vendor 全文
out, n = re.subn(r'/\*__VENDOR_MARKDOWN_IT__\*/[^\n]*', lambda m: vendor_safe, tpl, count=1)

with open(out_path, 'w', encoding='utf-8') as f:
    f.write(out)

print('BUILT ok=', n == 1, ' out=', out_path)
print('tpl_size=', len(tpl), 'vendor_size=', len(vendor), 'out_size=', len(out))
