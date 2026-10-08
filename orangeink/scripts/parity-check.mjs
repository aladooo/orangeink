#!/usr/bin/env node
// parity-check.mjs — 对拍护栏：浏览器版（orangeink index.html 原脚本在 jsdom 中执行）
// vs CLI 渲染器（render.mjs 移植版）。归一化 HTML 实体后 diff 应为 0。
// 用法：node parity-check.mjs <article.md> [index.html 路径]
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import { renderOrangeink } from './render.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mdPath = path.resolve(process.argv[2] || path.join(__dirname, '..', 'tests', 'sample.md'));
// 模板解析顺序（v1.2.3）：
//   1) argv[3] 显式指定的 index.html
//   2) 同仓检出路径 ../../index.html（skill 目录在 orangeink 仓内时）
//   3) 从仓库 raw 拉取（缓存到系统临时目录，1 小时内复用）——独立安装（用户级 skill 目录）也能跑
const repoTemplate = path.join(__dirname, '..', '..', 'index.html');
const RAW_URL = 'https://raw.githubusercontent.com/aladooo/orangeink/main/index.html';
async function resolveTemplate() {
  if (process.argv[3]) return { src: fs.readFileSync(path.resolve(process.argv[3]), 'utf-8'), from: 'argv' };
  if (fs.existsSync(repoTemplate)) return { src: fs.readFileSync(repoTemplate, 'utf-8'), from: 'repo checkout' };
  const os = await import('os');
  const cache = path.join(os.tmpdir(), 'orangeink-parity-index.html');
  if (fs.existsSync(cache) && Date.now() - fs.statSync(cache).mtimeMs < 3600_000)
    return { src: fs.readFileSync(cache, 'utf-8'), from: 'cache (tmpdir)' };
  const resp = await fetch(RAW_URL);
  if (!resp.ok) throw new Error('无法获取浏览器版模板：本地无 ' + repoTemplate + '，且 raw 拉取 HTTP ' + resp.status);
  const src = await resp.text();
  fs.writeFileSync(cache, src);
  return { src, from: 'raw.githubusercontent.com (cached to tmpdir)' };
}
let tpl;
try {
  tpl = await resolveTemplate();
} catch (e) {
  console.error('FAIL: ' + e.message);
  process.exit(1);
}
console.error('[parity] template from: ' + tpl.from);
const pageSrc = tpl.src;
const mdSrc = fs.readFileSync(mdPath, 'utf-8');

/* ① 浏览器版：原脚本在 jsdom 中执行 */
const dom = new JSDOM(pageSrc, {
  url: 'file:///orangeink/index.html',
  runScripts: 'dangerously',
  pretendToBeVisual: false,
  beforeParse(window) {
    window.matchMedia = window.matchMedia || (() => ({ matches:false, addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){} }));
  }
});
const win = dom.window;
if (!win.__tool || !win.__tool.copyHTML) {
  console.error('FAIL: 浏览器版脚本未在 jsdom 中完成初始化（__tool 不存在）');
  process.exit(1);
}
win.document.getElementById('editor').value = mdSrc;
win.__tool.render();
const browserHtml = win.__tool.copyHTML();

/* ② CLI 版：移植的渲染管线 */
const cli = renderOrangeink(mdSrc, { theme:'orangeink', zoom:1, pad:14 });
const cliHtml = cli.html;

/* ③ 归一化后比对（HTML 实体等价形式统一） */
const norm = s => s.replace(/&#160;/g, '&nbsp;');
const a = norm(browserHtml), b = norm(cliHtml);

if (a === b) {
  console.log('✓ PARITY OK — 浏览器版与 CLI 版输出完全一致（' + a.length + ' chars）');
  process.exit(0);
}

/* 不一致：输出首个差异位置上下文 */
console.log('✗ PARITY DIFF — 长度 browser=' + a.length + ' cli=' + b.length);
let i = 0;
while (i < Math.min(a.length, b.length) && a[i] === b[i]) i++;
const lo = Math.max(0, i - 120), hiB = Math.min(a.length, i + 160), hiC = Math.min(b.length, i + 160);
console.log('首个差异 @ ' + i);
console.log('--- browser ---');
console.log(a.slice(lo, hiB));
console.log('--- cli ---');
console.log(b.slice(lo, hiC));
process.exit(1);
