#!/usr/bin/env node
/**
 * 从真实 Edge 采集**原型成员**明细。
 *
 * 与 `collect-edge-globals.mjs` 的区别：那份只要全局名（1236 个），
 * 这份要每个构造函数原型上的成员名与 descriptor 形状（约 9000 项）。
 *
 * 全局名对齐只是最表层的一维——`getComputedStyle` 存在不代表它的原型成员
 * 齐全。这份数据用于成员级对比。
 *
 * 用法：node scripts/collect-edge-members.mjs --out fixtures/fingerprint/edge-members.json
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

// 采集脚本与 src/baseline/full-surface.js 的口径保持一致：
// 只读 descriptor 不触发 getter，Symbol key 只计数不展开。
const PAGE_BODY = `
  const describe = (target, key) => {
    let entry;
    try { entry = Object.getOwnPropertyDescriptor(target, key); }
    catch { return { unreadable: true }; }
    if (!entry) return null;
    return {
      configurable: Boolean(entry.configurable),
      enumerable: Boolean(entry.enumerable),
      writable: 'writable' in entry ? Boolean(entry.writable) : null,
      getter: typeof entry.get === 'function',
      setter: typeof entry.set === 'function',
      valueType: 'value' in entry ? typeof entry.value : null,
    };
  };
  const out = {};
  for (const name of Object.getOwnPropertyNames(globalThis)) {
    let value;
    try { value = globalThis[name]; } catch { continue; }
    if (typeof value !== 'function' || !value.prototype) continue;
    const prototype = value.prototype;
    const keys = Object.getOwnPropertyNames(prototype).sort();
    out[name] = {
      members: keys.map(key => ({ name: key, descriptor: describe(prototype, key) })),
      symbolCount: Object.getOwnPropertySymbols(prototype).length,
    };
  }
  document.getElementById('out').textContent = JSON.stringify({
    userAgent: navigator.userAgent,
    prototypes: out,
  });
`;

const PAGE = `<!doctype html><html><head><meta charset="utf-8"></head><body>`
  + `<pre id="out">pending</pre><script>${PAGE_BODY}</`
  + `script></body></html>`;

function findEdge(explicit) {
  for (const candidate of explicit ? [explicit, ...EDGE_CANDIDATES] : EDGE_CANDIDATES) {
    try { readFileSync(candidate); return candidate; } catch { /* next */ }
  }
  throw new Error('Edge not found; pass --edge <path>');
}

const args = process.argv.slice(2);
const edgeIndex = args.indexOf('--edge');
const outIndex = args.indexOf('--out');
const edgePath = findEdge(edgeIndex === -1 ? null : args[edgeIndex + 1]);

const baseDir = edgeTempDir(edgePath);
const workDir = mkdtempSync(path.join(baseDir, 'nv8-members-'));
const pagePath = path.join(workDir, 'members.html');

try {
  writeFileSync(pagePath, PAGE);
  const output = execFileSync(edgePath, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--virtual-time-budget=6000', '--dump-dom', toBrowserUrl(pagePath),
  ], { encoding: 'utf8', maxBuffer: 200 * 1024 * 1024,
       stdio: ['ignore', 'pipe', 'ignore'], timeout: 180_000 });

  const match = /<pre id="out">([\s\S]*?)<\/pre>/.exec(output);
  if (match === null) throw new Error('collector output not found in dumped DOM');
  const data = JSON.parse(
    match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  );
  data.collectedAt = new Date().toISOString();

  const total = Object.values(data.prototypes)
    .reduce((sum, entry) => sum + entry.members.length, 0);

  if (outIndex === -1) {
    console.log(`${Object.keys(data.prototypes).length} prototypes, ${total} members`);
  } else {
    writeFileSync(args[outIndex + 1], `${JSON.stringify(data)}\n`);
    console.log(`wrote ${args[outIndex + 1]}`);
    console.log(`  ${Object.keys(data.prototypes).length} prototypes, ${total} members`);
  }
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
