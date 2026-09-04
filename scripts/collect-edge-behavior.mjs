#!/usr/bin/env node
/**
 * 从真实 Edge 采集**行为**探针结果。
 *
 * 与 `collect-edge-globals.mjs` / `collect-edge-members.mjs` 的区别：那两份采
 * 集形状（有哪些名字、descriptor 是什么），这份采集行为（同一段代码跑出什么）。
 *
 * 探针定义来自 `src/baseline/behavior-probes.js`，与测试**共用同一份**——
 * 各写一份必然漂移，漂移后比较就没有意义。
 *
 * 走临时本地 HTTP 服务器而不是 `file://`：部分行为（location、同源判断）在
 * opaque origin 下与真实站点不同。
 *
 * 用法：node scripts/collect-edge-behavior.mjs --out fixtures/fingerprint/edge-behavior.json
 */

import http from 'node:http';
import { execFile } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';

import { BEHAVIOR_PROBES, buildProbeExpression } from '../src/baseline/behavior-probes.js';

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

/**
 * 采集一轮。
 *
 * @param {string} edgePath
 * @returns {Promise<object>}
 */
async function collectOnce(edgePath) {
  const page = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<pre id="out">pending</pre>
<script>
try {
  document.getElementById('out').textContent = JSON.stringify({
    __userAgent: navigator.userAgent,
    results: JSON.parse((${buildProbeExpression()})),
  });
} catch (error) {
  document.getElementById('out').textContent = JSON.stringify({ __error: String(error && error.message) });
}
</` + `script></body></html>`;

  const server = http.createServer((request, response) => {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(page);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    const dom = await new Promise((resolve, reject) => {
      execFile(edgePath, [
        '--headless=new', '--disable-gpu', '--no-sandbox',
        '--virtual-time-budget=5000', '--dump-dom', `http://127.0.0.1:${port}/`,
      ], { encoding: 'utf8', maxBuffer: 40 * 1024 * 1024, timeout: 120_000 },
      (error, stdout) => (error && !stdout ? reject(error) : resolve(stdout)));
    });

    const match = /<pre id="out">([\s\S]*?)<\/pre>/.exec(dom);
    if (match === null) throw new Error('probe output not found in dumped DOM');
    const decoded = match[1]
      .replace(/&quot;/g, '"').replace(/&#039;/g, "'")
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    const parsed = JSON.parse(decoded);
    if (parsed.__error !== undefined) {
      throw new Error(`probe script failed in the browser: ${parsed.__error}`);
    }
    return parsed;
  } finally {
    server.close();
  }
}

const args = process.argv.slice(2);
const edgeIndex = args.indexOf('--edge');
const outIndex = args.indexOf('--out');
const edgePath = findEdge(edgeIndex === -1 ? null : args[edgeIndex + 1]);

// 跑两轮并要求逐字一致。探针的准入条件之一是「跨运行确定」，
// 采集时就验证，而不是等到比较阶段才发现结果本身在抖。
const first = await collectOnce(edgePath);
const second = await collectOnce(edgePath);

const unstable = Object.keys(first.results).filter(
  id => JSON.stringify(first.results[id]) !== JSON.stringify(second.results[id]),
);
if (unstable.length > 0) {
  console.error('这些探针在两轮采集间结果不同，不能作为行为契约：');
  for (const id of unstable) {
    console.error(`  ${id}`);
    console.error(`    1: ${JSON.stringify(first.results[id])}`);
    console.error(`    2: ${JSON.stringify(second.results[id])}`);
  }
  process.exit(1);
}

const missing = BEHAVIOR_PROBES.filter(entry => first.results[entry.id] === undefined);
if (missing.length > 0) {
  console.error(`采集结果缺少 ${missing.length} 个探针：`);
  for (const entry of missing) console.error(`  ${entry.id}`);
  process.exit(1);
}

// 记下采集用的 UA。这份 fixture 原来只有 `collectedAt`——版本无从考证，而
// 「采集基准版本必须与 profile 一致」这个坑已经踩过两次，靠时间戳倒推版本
// 是下一次踩坑的入口。
const payload = {
  collectedAt: new Date().toISOString(),
  userAgent: first.__userAgent,
  probeCount: BEHAVIOR_PROBES.length,
  results: first.results,
};

if (outIndex === -1) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  writeFileSync(args[outIndex + 1], `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`wrote ${args[outIndex + 1]}: ${BEHAVIOR_PROBES.length} probes (2 轮结果一致)`);
}
