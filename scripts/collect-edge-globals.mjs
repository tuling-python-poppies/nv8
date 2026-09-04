#!/usr/bin/env node
/**
 * 从真实 Edge 采集 `globalThis` 的全部 own property 名。
 *
 * 与 `collect-edge-fingerprint.mjs` 分开：那份采集指纹字段（UA/brands/WebGL），
 * 这份只要全局名列表，用于 surface 对等性检查。分开是因为全局列表有上千项，
 * 混在指纹 JSON 里会让后者难以人工核对。
 *
 * 用法：node scripts/collect-edge-globals.mjs --out fixtures/fingerprint/edge-globals.json
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { edgeTempDir, toBrowserUrl } from './edge-temp-dir.mjs';

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

// 采集时不排序。**顺序本身就是数据**：`src/install/window-surface-order.js`
// 直接照抄这份序列，NV8 靠它复现 `Object.getOwnPropertyNames(window)`。
// 实测 Edge 151 → 152 有 9 个已有全局挪了位置，所以排序会丢真信息。
//
// `descriptors` 同时采下每一项的 descriptor flag。缺了它，新增全局的形状只能靠
// 猜——而 window 上 1175 个 own property 的 flag 分五种，猜错不会报错，只会变成
// 一处可探测偏差（`chrome` 被写成 configurable: false 就是这么来的）。
//
// 整段包在 IIFE 里：经典脚本的顶层 `var` 会变成 globalThis 的 own property，
// 直接把 4 个采集变量掺进结果（实测 1239 → 1243）。
const PAGE = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<pre id="out">pending</pre>
<script>
document.getElementById('out').textContent = (function () {
  var names = Object.getOwnPropertyNames(globalThis);
  var descriptors = {};
  for (var i = 0; i < names.length; i++) {
    var entry = Object.getOwnPropertyDescriptor(globalThis, names[i]);
    descriptors[names[i]] = {
      kind: ('get' in entry || 'set' in entry) ? 'accessor' : 'value',
      writable: 'writable' in entry ? entry.writable : null,
      enumerable: entry.enumerable,
      configurable: entry.configurable,
      hasGet: 'get' in entry ? (typeof entry.get === 'function') : null,
      hasSet: 'set' in entry ? (typeof entry.set === 'function') : null,
    };
  }
  return JSON.stringify({
    userAgent: navigator.userAgent,
    globals: names,
    descriptors: descriptors,
  });
})();
</` + `script></body></html>`;

function findEdge(explicit) {
  for (const candidate of explicit ? [explicit, ...EDGE_CANDIDATES] : EDGE_CANDIDATES) {
    try {
      readFileSync(candidate);
      return candidate;
    } catch {
      // 试下一个
    }
  }
  throw new Error('Edge not found; pass --edge <path>');
}

const args = process.argv.slice(2);
const edgeIndex = args.indexOf('--edge');
const outIndex = args.indexOf('--out');
const edgePath = findEdge(edgeIndex === -1 ? null : args[edgeIndex + 1]);

const baseDir = edgeTempDir(edgePath);
const workDir = mkdtempSync(path.join(baseDir, 'nv8-globals-'));
const pagePath = path.join(workDir, 'globals.html');

try {
  writeFileSync(pagePath, PAGE);
  const output = execFileSync(edgePath, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--virtual-time-budget=4000', '--dump-dom', toBrowserUrl(pagePath),
  ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 120_000 });

  const match = /<pre id="out">([\s\S]*?)<\/pre>/.exec(output);
  if (match === null) throw new Error('collector output not found in dumped DOM');
  const data = JSON.parse(
    match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  );
  data.collectedAt = new Date().toISOString();

  if (outIndex === -1) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    writeFileSync(args[outIndex + 1], `${JSON.stringify(data, null, 2)}\n`);
    console.log(`wrote ${args[outIndex + 1]}: ${data.globals.length} globals`);
  }
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
