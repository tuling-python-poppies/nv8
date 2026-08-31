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
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';

const EDGE_CANDIDATES = [
  '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/mnt/c/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/microsoft-edge',
  '/usr/bin/microsoft-edge-stable',
];

// 采集时不排序。实测真实 Edge 的 Object.getOwnPropertyNames(globalThis)
// 本身就近似字母序（WebIDL 接口按字母序注册），因此排序不丢信息；
// 但保留原始顺序才能在将来顺序变化时被发现。
const PAGE = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<pre id="out">pending</pre>
<script>
document.getElementById('out').textContent = JSON.stringify({
  userAgent: navigator.userAgent,
  globals: Object.getOwnPropertyNames(globalThis),
});
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

function toBrowserUrl(filePath) {
  if (filePath.startsWith('/mnt/')) {
    const [, , drive, ...rest] = filePath.split('/');
    return `file:///${drive.toUpperCase()}:/${rest.join('/')}`;
  }
  return `file://${filePath}`;
}

const args = process.argv.slice(2);
const edgeIndex = args.indexOf('--edge');
const outIndex = args.indexOf('--out');
const edgePath = findEdge(edgeIndex === -1 ? null : args[edgeIndex + 1]);

const baseDir = edgePath.startsWith('/mnt/') ? '/mnt/c/temp' : tmpdir();
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
