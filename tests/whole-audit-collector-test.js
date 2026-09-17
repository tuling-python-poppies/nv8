/**
 * 全仓审计回归（第三批）：Collector 会话/熔断/生命周期与构建检查。
 *
 * 覆盖 F07/F08/F09/F10/F13。全部使用本地 stub transport，不发起真实请求。
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Collector } from '../src/collection/collector/collector.js';
import { createCollectorResponse } from '../src/collection/collector/transport.js';
import { CircuitBreaker } from '../src/collection/collector/circuit-breaker.js';
import { CollectorErrorCode } from '../src/collection/collector/errors.js';

const gate = () => {
  let resolve;
  const promise = new Promise(r => { resolve = r; });
  return { promise, resolve };
};

const ORIGIN = 'https://fixture.test/';

test('F07 dispose aborts an in-flight backoff and blocks further sends', async () => {
  const entered = gate();
  const release = gate();
  let sends = 0;
  let disposedTransport = 0;
  const collector = new Collector({
    policy: { enabled: true, allowedOrigins: [ORIGIN] },
    retry: { maxAttempts: 3, baseDelayMs: 0, maxDelayMs: 0 },
    sleep: async () => { entered.resolve(); await release.promise; },
    transport: {
      async send() {
        sends += 1;
        return createCollectorResponse({ status: 503 });
      },
      async dispose() { disposedTransport += 1; },
    },
  });
  const sending = collector.send({ method: 'GET', url: ORIGIN });
  sending.catch(() => {});
  await entered.promise;
  await collector.dispose();
  release.resolve();
  await assert.rejects(sending, error => error.code === CollectorErrorCode.DISPOSED);
  assert.equal(sends, 1, 'dispose must stop the retry loop before the next send');
  assert.equal(disposedTransport, 1, 'dispose must await the transport teardown');
  await assert.rejects(
    collector.send({ method: 'GET', url: ORIGIN }),
    error => error.code === CollectorErrorCode.DISPOSED,
  );
  await collector.dispose();
});

test('F08 retries re-resolve the session jar after Set-Cookie', async () => {
  const cookieNames = [];
  let calls = 0;
  const collector = new Collector({
    policy: { enabled: true, allowedOrigins: [ORIGIN] },
    retry: { maxAttempts: 2, baseDelayMs: 0, maxDelayMs: 0 },
    sleep: async () => {},
    transport: {
      async send(request) {
        cookieNames.push(request.cookies.map(entry => entry.name));
        calls += 1;
        return createCollectorResponse({
          status: calls === 1 ? 503 : 200,
          headers: calls === 1 ? { 'set-cookie': 'local_session=fixture; Path=/' } : {},
        });
      },
    },
  });
  try {
    const result = await collector.send({ method: 'GET', url: ORIGIN });
    assert.equal(result.response.status, 200);
    assert.deepEqual(cookieNames, [[], ['local_session']]);
    assert.ok(collector.cookieJar.cookiesFor(ORIGIN).has('local_session'));
  } finally {
    await collector.dispose();
  }
});

test('F09 one redirect hop must not bypass the target origin circuit breaker', async () => {
  const breaker = new CircuitBreaker({ failureThreshold: 1, cooldownMs: 100_000 });
  breaker.recordFailure('https://b.test/');
  const calls = [];
  const collector = new Collector({
    policy: {
      enabled: true,
      followRedirects: true,
      allowCrossOriginRedirect: true,
      allowedOrigins: ['https://a.test', 'https://b.test'],
    },
    circuitBreaker: breaker,
    retry: { maxAttempts: 1 },
    sleep: async () => {},
    transport: {
      async send(request) {
        calls.push(request.origin);
        return createCollectorResponse({
          status: calls.length === 1 ? 302 : 200,
          headers: calls.length === 1 ? { location: 'https://b.test/' } : {},
        });
      },
    },
  });
  try {
    await assert.rejects(
      collector.send({ method: 'GET', url: 'https://a.test/' }),
      error => error.code === CollectorErrorCode.CIRCUIT_OPEN,
    );
    assert.deepEqual(calls, ['https://a.test'], 'no send may reach the open origin');
    assert.equal(breaker.stateFor('https://b.test/'), 'open');
  } finally {
    await collector.dispose();
  }
});

test('F10 default retry backoff keeps a short-lived process alive', async () => {
  const collectorUrl = new URL('../src/collection/collector/collector.js', import.meta.url).href;
  const transportUrl = new URL('../src/collection/collector/transport.js', import.meta.url).href;
  const code = `
import { Collector } from ${JSON.stringify(collectorUrl)};
import { createCollectorResponse } from ${JSON.stringify(transportUrl)};
let calls = 0;
const collector = new Collector({
  policy: { enabled: true, allowedOrigins: ['https://fixture.test'] },
  retry: { maxAttempts: 2, baseDelayMs: 5, maxDelayMs: 5, jitterRatio: 0 },
  transport: { async send() { console.log('attempt', ++calls); return createCollectorResponse({ status: calls === 1 ? 503 : 200 }); } },
});
const result = await collector.send({ method: 'GET', url: 'https://fixture.test/' });
console.log('done', result.response.status);
await collector.dispose();
`;
  const child = spawn(process.execPath, ['--input-type=module', '-e', code], {
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', chunk => { stdout += chunk; });
  child.stderr.on('data', chunk => { stderr += chunk; });
  const exitCode = await new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('close', resolve);
  });
  assert.equal(exitCode, 0, `child exited early: ${stderr}`);
  assert.match(stdout, /done 200/, 'the retry must complete before the process exits');
});

test('F13 bundle check rejects stale source or a missing module set', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'nv8-bundle-audit-'));
  try {
    await mkdir(join(dir, 'scripts'));
    await mkdir(join(dir, 'src/engine/bootstrap'), { recursive: true });
    await mkdir(join(dir, 'src/engine/realm'), { recursive: true });
    await writeFile(
      join(dir, 'scripts/build-module-bundle.mjs'),
      await readFile(new URL('../scripts/build-module-bundle.mjs', import.meta.url)),
    );
    for (const name of ['root', 'worker', 'worklet']) {
      await writeFile(
        join(dir, `src/engine/bootstrap/bootstrap-${name}.js`),
        'export const currentVersion = 2;',
      );
    }
    const key = pathToFileURL(join(dir, 'src/engine/bootstrap/bootstrap-root.js')).href;
    const bundlePath = join(dir, 'src/engine/realm/module-bundle.json');
    const run = args => new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [join(dir, 'scripts/build-module-bundle.mjs'), ...args], {
        cwd: dir,
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
      });
      child.stdout.resume();
      child.stderr.resume();
      child.on('error', reject);
      child.on('close', resolve);
    });

    // 旧源码 + 缺模块：只核对键路径的实现会误判为通过。
    await writeFile(bundlePath, JSON.stringify({ [key]: 'export const currentVersion = 1;' }));
    assert.equal(await run(['--check']), 1, 'stale bundle must fail --check');

    // 重新生成后通过，且生成内容与新图一致。
    assert.equal(await run([]), 0);
    assert.equal(await run(['--check']), 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
