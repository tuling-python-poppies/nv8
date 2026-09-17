/**
 * 全仓审计收尾回归（F-E2..F-E5）：控制器时序、owner 生命周期、跨 Sandbox
 * 状态隔离与剩余 timer 保活语义。
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { EdgeSandbox } from '../src/public/edge-sandbox.js';
import { normalizeRuntimeOptions } from '../src/public/edge-runtime-options.js';
import { RuntimeController } from '../src/backend/controller/runtime-controller.js';
import { createApp } from '../src/engine/core/app.js';
import { createScriptInjector } from '../src/engine/core/script-injector.js';
import { drainWorkerThreadPool } from '../src/backend/controller/worker-thread-pool.js';
import { drainTasks } from './helpers/async-wait.js';

const REPLAY = [
  { url: 'https://fixture.test/shared.js', repeat: 'unlimited', body: 'registerPaint("shared", class {});' },
  { url: 'https://fixture.test/a.js', repeat: 'unlimited', body: 'import "./shared.js";' },
  { url: 'https://fixture.test/b.js', repeat: 'unlimited', body: 'import "./shared.js";' },
];

test('F-E2 close during start settles into a closed lifecycle', async () => {
  const options = normalizeRuntimeOptions({
    execution: { backend: 'child-process' },
    page: { url: 'https://controller.test/' },
    limits: { timeoutMs: 10_000 },
  });
  const controller = new RuntimeController(options);
  const starting = controller.start();
  const closing = controller.close();
  await Promise.allSettled([starting, closing]);
  await assert.rejects(controller.evaluate('1'), /closed/i);
  await controller.close();
});

test('F-E3 disposed script injector never schedules or executes', async () => {
  let evaluations = 0;
  const realm = { global: {}, evaluate() { evaluations += 1; } };
  const injector = createScriptInjector(realm, { strategy: 'async' });

  injector.registerScript('https://fixture.test/a.js', 'globalThis.x = 1;', { async: true });
  injector.dispose();
  await drainTasks();

  const late = injector.registerScript('https://fixture.test/b.js', 'globalThis.y = 1;', { async: true });
  await drainTasks();

  assert.equal(evaluations, 0);
  assert.equal(late.executed, true);
  await injector.waitForAllScripts();
});

test('F-E3 concurrent worklet addModule serializes per Realm and reuses shared graphs', async () => {
  const sandbox = await EdgeSandbox.create({
    execution: { backend: 'child-process' },
    page: { url: 'https://fixture.test/' },
    limits: { timeoutMs: 10_000 },
    replay: REPLAY,
  });
  try {
    const concurrent = await sandbox.evaluate(`Promise.all([
      CSS.paintWorklet.addModule('/a.js'),
      CSS.paintWorklet.addModule('/a.js'),
      CSS.paintWorklet.addModule('/b.js'),
    ]).then(() => 'ok', error => error.name + ': ' + error.message)`);
    assert.equal(concurrent.value, 'ok');

    // reset 之后是新 Realm：同一入口可以重新注册，不应带着旧 worklet 状态。
    await sandbox.setPage({ url: 'https://fixture.test/next' });
    const afterReset = await sandbox.evaluate(
      `CSS.paintWorklet.addModule('/a.js').then(() => 'ok', error => error.name + ': ' + error.message)`,
    );
    assert.equal(afterReset.value, 'ok');
  } finally {
    await sandbox.close();
    drainWorkerThreadPool();
  }
});

test('F-E4 destroying one App sandbox keeps the other sandbox state', async () => {
  const app = createApp({ trace: false });
  app.registerPlugin({ id: 'noop', version: '1.0.0', install() {} });
  app.registerProfile({ id: 'p', plugins: ['noop'] });
  const first = await app.createSandbox({ profile: 'p' });
  const second = await app.createSandbox({ profile: 'p' });
  first.setState('shared-key', 'first');
  second.setState('shared-key', 'second');

  await app.destroySandbox(first.id);

  assert.equal(second.getState('shared-key'), 'second');
  assert.equal(app.getState('shared-key'), undefined);
  await app.destroy();
  assert.equal(app.diagnose().destroyed, true);
});

test('F-E5 createDeadline keeps a short-lived process alive until it fires', async () => {
  const deadlineUrl = new URL('../src/backend/controller/deadline.js', import.meta.url).href;
  const code = `
import { createDeadline } from ${JSON.stringify(deadlineUrl)};
createDeadline(20, () => console.log('deadline-fired'));
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
  assert.equal(exitCode, 0, stderr);
  assert.match(stdout, /deadline-fired/, 'the deadline must not be dropped by an early exit');
});
