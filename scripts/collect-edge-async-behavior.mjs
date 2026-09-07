#!/usr/bin/env node
/**
 * 从真实 Edge 采集 Worker / ServiceWorker 异步行为探针。
 *
 * 与同步行为 fixture 分开：这里等待消息或 ServiceWorker ready/controllerchange，
 * 结果仍必须跨运行确定、与机器无关、可序列化。
 */

import http from 'node:http';
import { execFile } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import {
  ASYNC_BEHAVIOR_PROBES,
  buildAsyncProbeExpression,
} from '../src/infra/baseline/async-behavior-probes.js';

const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/mnt/c/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/microsoft-edge',
  '/usr/bin/microsoft-edge-stable',
];

const WORKER_SCRIPTS = {
  '/worker-message.js': 'postMessage("ready");',
  '/worker-late.js': 'setTimeout(() => postMessage("late"), 0);',
  '/worker-sentinel.js': 'postMessage("sentinel");',
};

function findEdge(explicit) {
  for (const candidate of explicit ? [explicit, ...EDGE_CANDIDATES] : EDGE_CANDIDATES) {
    try {
      readFileSync(candidate);
      return candidate;
    } catch {
      // try the next candidate
    }
  }
  throw new Error('Edge not found; pass --edge <path>');
}

async function collectOnce(edgePath, probes) {
  const page = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<pre id="out">pending</pre>
<script>
(async () => {
  try {
    document.getElementById('out').textContent = JSON.stringify({
      __userAgent: navigator.userAgent,
      results: JSON.parse(await (${buildAsyncProbeExpression(probes)})),
    });
  } catch (error) {
    document.getElementById('out').textContent = JSON.stringify({ __error: String(error && error.message) });
  }
})();
</script></body></html>`;

  const server = http.createServer((request, response) => {
    if (WORKER_SCRIPTS[request.url] !== undefined) {
      response.writeHead(200, {
        'content-type': 'application/javascript; charset=utf-8',
        'cache-control': 'no-store',
      });
      response.end(WORKER_SCRIPTS[request.url]);
      return;
    }
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(page);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    const dom = await new Promise((resolve, reject) => {
      execFile(edgePath, [
        '--headless=new', '--disable-gpu', '--no-sandbox',
        '--virtual-time-budget=10000', '--dump-dom', `http://localhost:${port}/app/page`,
      ], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, timeout: 120_000 },
      (error, stdout) => (error && !stdout ? reject(error) : resolve(stdout)));
    });
    const match = /<pre id="out">([\s\S]*?)<\/pre>/.exec(dom);
    if (match === null) throw new Error('probe output not found in dumped DOM');
    const decoded = match[1]
      .replace(/&quot;/g, '"').replace(/&#039;/g, "'")
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    if (decoded === 'pending') {
      throw new Error(`probe page stayed pending; dump tail: ${dom.slice(-2000)}`);
    }
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
const probeIndex = args.indexOf('--probe');
const edgePath = findEdge(edgeIndex === -1 ? null : args[edgeIndex + 1]);
const probes = probeIndex === -1
  ? ASYNC_BEHAVIOR_PROBES
  : ASYNC_BEHAVIOR_PROBES.filter(entry => entry.id === args[probeIndex + 1]);
if (probes.length === 0) throw new Error('unknown async probe; pass a valid --probe id');
const first = await collectOnce(edgePath, probes);
const second = await collectOnce(edgePath, probes);

const unstable = Object.keys(first.results).filter(
  id => JSON.stringify(first.results[id]) !== JSON.stringify(second.results[id]),
);
if (unstable.length > 0) {
  console.error('这些异步探针在两轮采集间结果不同，不能作为行为契约：');
  for (const id of unstable) {
    console.error(`  ${id}`);
    console.error(`    1: ${JSON.stringify(first.results[id])}`);
    console.error(`    2: ${JSON.stringify(second.results[id])}`);
  }
  process.exit(1);
}

const missing = probes.filter(entry => first.results[entry.id] === undefined);
if (missing.length > 0) {
  console.error(`采集结果缺少 ${missing.length} 个异步探针：`);
  for (const entry of missing) console.error(`  ${entry.id}`);
  process.exit(1);
}

const payload = {
  collectedAt: new Date().toISOString(),
  userAgent: first.__userAgent,
  probeCount: probes.length,
  results: first.results,
};

if (outIndex === -1) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  writeFileSync(args[outIndex + 1], `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`wrote ${args[outIndex + 1]}: ${probes.length} probes (2 轮结果一致)`);
}
