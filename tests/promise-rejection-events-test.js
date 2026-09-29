/**
 * Promise 拒绝生命周期事件
 *
 * 迁移前未处理拒绝只在子进程 stderr 留一条诊断，Realm 内看不到任何信号：
 * 页面里 `unhandledrejection` 监听器（错误上报 SDK、反爬的完整性检查）
 * 永远不触发。现在按 HTML 语义派发：
 *
 * - 未处理拒绝 → `unhandledrejection`（PromiseRejectionEvent，`isTrusted`，
 *   cancelable，`promise` / `reason` 齐全）；
 * - `event.preventDefault()` 取消默认动作（console 的 `Uncaught (in promise)`）；
 * - 之后才接住 → `rejectionhandled`，`reason` 仍是原始拒绝原因。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { waitUntil } from './helpers/async-wait.js';

let sandboxPromise = null;

function sandbox() {
  sandboxPromise ??= (async () => {
    const { createSandbox } = await import('../src/public/create-sandbox.js');
    return createSandbox('https://rejection.test/', {
      page: { html: '<!doctype html><html><body></body></html>' },
      limits: { timeoutMs: 30_000 },
    });
  })();
  return sandboxPromise;
}

async function run(source) {
  const instance = await sandbox();
  return instance.run(source);
}

async function waitForEvents(expectedLength) {
  await waitUntil(
    async () => (await run('globalThis.__rejections.length')) >= expectedLength,
    { label: `${expectedLength} window rejection event(s)` },
  );
}

test.after(async () => {
  if (sandboxPromise === null) return;
  const instance = await sandboxPromise;
  await instance.close();
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  createSandbox.drain();
});

test('unhandled and later-handled rejections fire both window events', async () => {
  await run(`
    globalThis.__rejections = [];
    addEventListener('unhandledrejection', event => __rejections.push({
      type: event.type,
      isTrusted: event.isTrusted,
      cancelable: event.cancelable,
      reasonMessage: event.reason && event.reason.message,
      samePromise: event.promise === __rejected,
    }));
    addEventListener('rejectionhandled', event => __rejections.push({
      type: event.type,
      isTrusted: event.isTrusted,
      reasonMessage: event.reason && event.reason.message,
    }));
    globalThis.__rejected = Promise.reject(new Error('reject-probe'));
    void 0;
  `);
  await waitForEvents(1);

  await run('__rejected.catch(() => {})');
  await waitForEvents(2);

  const events = JSON.parse(await run('JSON.stringify(__rejections)'));
  assert.deepEqual(events, [
    {
      type: 'unhandledrejection',
      isTrusted: true,
      cancelable: true,
      reasonMessage: 'reject-probe',
      samePromise: true,
    },
    {
      type: 'rejectionhandled',
      isTrusted: true,
      reasonMessage: 'reject-probe',
    },
  ]);
});

test('preventDefault marks the event as handled', async () => {
  const observed = await run(`
    new Promise(resolve => {
      Promise.reject(new Error('prevented-probe'));
      addEventListener('unhandledrejection', event => {
        event.preventDefault();
        queueMicrotask(() => resolve(event.defaultPrevented));
      }, { once: true });
    })
  `);

  assert.equal(observed, true);
});
