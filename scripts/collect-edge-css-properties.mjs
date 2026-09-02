#!/usr/bin/env node
/**
 * 采集真实 Edge 的 CSS 属性访问器清单。
 *
 * 关键实测结论：CSS 属性访问器是 **style 对象的自有属性**（745 个），
 * 不在 `CSSStyleDeclaration.prototype` 上——真实 Edge 的 prototype 只有 10 个
 * 成员（constructor / cssFloat / cssText / getPropertyValue / setProperty / ...）。
 *
 * 顺序有意义：`Object.getOwnPropertyNames(el.style)` 的顺序在真实浏览器里是
 * 确定的，所以按原样保留，不排序。
 *
 * 用法：node scripts/collect-edge-css-properties.mjs --out fixtures/fingerprint/edge-css-properties.json
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
  '/usr/bin/microsoft-edge-stable',
];

function findEdge() {
  for (const candidate of EDGE_CANDIDATES) {
    try { readFileSync(candidate); return candidate; } catch { /* next */ }
  }
  throw new Error('Edge not found');
}

const PAGE = `<!doctype html><html><body><pre id="out">p</pre><script>
const style = document.createElement('div').style;
const names = Object.getOwnPropertyNames(style);
const sample = {};
for (const name of names.slice(0, 4)) {
  const d = Object.getOwnPropertyDescriptor(style, name);
  sample[name] = {
    getter: typeof d.get === 'function',
    setter: typeof d.set === 'function',
    enumerable: d.enumerable,
    configurable: d.configurable,
    unsetValue: JSON.stringify(style[name]),
  };
}
document.getElementById('out').textContent = JSON.stringify({ names, sample });
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
    '--virtual-time-budget=5000', '--dump-dom', `http://127.0.0.1:${port}/`,
  ], { encoding: 'utf8', maxBuffer: 60 * 1024 * 1024, timeout: 120_000 },
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
  count: data.names.length,
  descriptorSample: data.sample,
  names: data.names,
};
if (outIndex === -1) {
  console.log(`${data.names.length} 个 CSS 属性访问器`);
} else {
  writeFileSync(process.argv[outIndex + 1], `${JSON.stringify(payload, null, 1)}\n`);
  console.log(`wrote ${process.argv[outIndex + 1]}: ${data.names.length} 个属性`);
}
