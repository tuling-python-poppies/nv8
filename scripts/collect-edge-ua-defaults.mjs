#!/usr/bin/env node
/**
 * 采集真实 Edge 的 UA 默认样式表（**仅与布局无关**的属性）。
 *
 * 与布局相关的属性由**差分实测**排除（见 `LAYOUT_DEPENDENT`），不是手写白名单。
 * 其余 730 个属性在视口与内容两组差分里都稳定，全部采集。
 *
 * 用法：node scripts/collect-edge-ua-defaults.mjs --out fixtures/fingerprint/edge-ua-defaults.json
 */

import http from 'node:http';
import { execFile } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';

const EDGE_CANDIDATES = [
  // 原生 Windows 路径放在最前：脚本原来只列了 WSL(/mnt/c) 与 Linux 路径，
  // 在 Windows 上必须手动 --edge。而『基准跟随本机 Edge』要成为常规做法，
  // 就不能依赖每次手动传参。
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/mnt/c/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/microsoft-edge',
];

function findEdge() {
  for (const candidate of EDGE_CANDIDATES) {
    try { readFileSync(candidate); return candidate; } catch { /* next */ }
  }
  throw new Error('Edge not found');
}

/**
 * 与**布局相关**的属性——刻意排除，不建模。
 *
 * 这份名单不是手写猜的，是两组差分实测出来的：
 *
 * 1. 同一页面在 `--window-size=800,600` 与 `1400,900` 下采集，
 *    值不同的 7 项 → 与视口相关
 * 2. 同一视口下空 div 与填充 400 字符 + 20 个 `<br>` 的 div 对比，
 *    值不同的 7 项 → 与内容排版相关
 *
 * 两组并集 10 项。其余 730 个属性在两组差分里都稳定，可以建模。
 *
 * 只做第 1 组会漏掉 `height` / `blockSize`——空 div 在两种视口下都是 0px。
 */
const LAYOUT_DEPENDENT = new Set([
  'width', 'inlineSize', 'webkitLogicalWidth',
  'height', 'blockSize', 'webkitLogicalHeight',
  'transformOrigin', 'webkitTransformOrigin',
  'perspectiveOrigin', 'webkitPerspectiveOrigin',
]);

/** 覆盖常见标签。每个都用**空元素**，避免内容影响。 */
const TAGS = [
  'div', 'span', 'p', 'a', 'button', 'input', 'ul', 'ol', 'li', 'table',
  'thead', 'tbody', 'tr', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'em', 'strong', 'b', 'i', 'u', 's', 'small', 'code', 'pre', 'blockquote',
  'script', 'style', 'head', 'title', 'link', 'meta', 'img', 'br', 'hr',
  'form', 'label', 'select', 'option', 'textarea', 'fieldset', 'legend',
  'header', 'footer', 'nav', 'main', 'section', 'article', 'aside', 'figure',
  'figcaption', 'dl', 'dt', 'dd', 'iframe', 'canvas', 'video', 'audio',
  'template', 'slot', 'noscript', 'output', 'progress', 'meter', 'details',
  'summary', 'dialog', 'menu', 'address', 'cite', 'q', 'abbr', 'sub', 'sup',
  'mark', 'del', 'ins', 'kbd', 'samp', 'var', 'wbr', 'bdi', 'bdo', 'ruby',
  'caption', 'colgroup', 'col', 'tfoot', 'nv8unknown',
];

const PAGE = `<!doctype html><html><body><pre id="out">p</pre><script>
const layoutDependent = new Set(${JSON.stringify([...LAYOUT_DEPENDENT])});
const tags = ${JSON.stringify(TAGS)};
const probe = document.createElement('div');
document.body.appendChild(probe);
const allProps = Object.getOwnPropertyNames(probe.style).filter(n => !layoutDependent.has(n));
document.body.removeChild(probe);
const out = {};
const host = document.body;
for (const tag of tags) {
  let el;
  try { el = document.createElement(tag); } catch { continue; }
  host.appendChild(el);
  const cs = getComputedStyle(el);
  const entry = {};
  for (const prop of allProps) {
    const value = cs[prop];
    if (value !== undefined && value !== '') entry[prop] = value;
  }
  out[tag] = entry;
  host.removeChild(el);
}
// html 与 body 无法用"创建一个元素塞进 body"的方式测——不能把 <body> 嵌进 body。
// 它们必须直接测页面上已有的那两个节点。漏掉的后果很直观：
// getComputedStyle(document.body).display 会退回 <nv8unknown> 基线的 inline，
// 而真实浏览器是 block。
for (const [name, node] of [['html', document.documentElement], ['body', document.body]]) {
  const cs = getComputedStyle(node);
  const entry = {};
  for (const prop of allProps) {
    const value = cs[prop];
    if (value !== undefined && value !== '') entry[prop] = value;
  }
  out[name] = entry;
}
document.getElementById('out').textContent = JSON.stringify({ properties: allProps, tags: out });
</` + `script></body></html>`;

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  response.end(PAGE);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();

const dom = await new Promise((resolve, reject) => {
  execFile(findEdge(), [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    // **必须锁定 locale**。默认会跟随采集机器的系统语言，而字体族是
    // locale 相关的：实测中文环境给 `"Noto Sans SC"`、en-US 给
    // `"Times New Roman"`。NV8 的 profile 声明 languages 为 en-US，
    // 采集不锁 locale 就会把采集机器的字体烙进默认样式表——那是最典型的
    // 机器指纹泄漏。
    '--lang=en-US', '--accept-lang=en-US,en',
    '--virtual-time-budget=6000', '--dump-dom', `http://127.0.0.1:${port}/`,
  ], { encoding: 'utf8', maxBuffer: 100 * 1024 * 1024, timeout: 180_000 },
  (error, stdout) => (error && !stdout ? reject(error) : resolve(stdout)));
});
server.close();

const match = /<pre id="out">([\s\S]*?)<\/pre>/.exec(dom);
if (match === null) throw new Error('probe output not found');
const data = JSON.parse(
  match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#039;/g, "'")
);

const outIndex = process.argv.indexOf('--out');
const payload = {
  collectedAt: new Date().toISOString(),
  layoutDependentExcluded: [...LAYOUT_DEPENDENT],
  properties: data.properties,
  tags: data.tags,
};
if (outIndex === -1) {
  console.log(`${Object.keys(data.tags).length} 个标签 × ${data.properties.length} 属性`);
} else {
  writeFileSync(process.argv[outIndex + 1], `${JSON.stringify(payload, null, 1)}\n`);
  console.log(
    `wrote ${process.argv[outIndex + 1]}: `
    + `${Object.keys(data.tags).length} 标签 × ${data.properties.length} 属性`
  );
}
