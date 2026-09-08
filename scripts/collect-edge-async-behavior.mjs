#!/usr/bin/env node
/**
 * 从真实 Edge 采集 Worker / ServiceWorker 异步行为探针。
 *
 * Dedicated Worker 仍可用 `--dump-dom`。ServiceWorker 注册/激活必须等真实
 * Promise，因此走最小 CDP 客户端。两轮结果必须逐字一致才写入 fixture。
 */

import http from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import {
  ASYNC_BEHAVIOR_PROBES,
  buildAsyncProbeExpression,
} from '../src/infra/baseline/async-behavior-probes.js';
import { launchEdgeCdp } from './edge-cdp.mjs';

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
  '/sw.js': `self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('message', event => {
  if (event.data && event.data.kind === 'roundtrip') {
    event.source.postMessage({ kind: 'reply', value: event.data.value });
  }
});`,
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
    response.end('<!doctype html><html><body>probe</body></html>');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const browser = await launchEdgeCdp(edgePath, { timeoutMs: 25_000 });
  try {
    const sessionId = await browser.openPage(`http://localhost:${port}/app/page`);
    const raw = await browser.evaluate(sessionId, buildAsyncProbeExpression(probes));
    return {
      __userAgent: browser.userAgent,
      results: typeof raw === 'string' ? JSON.parse(raw) : raw,
    };
  } finally {
    await browser.close();
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
