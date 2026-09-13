/**
 * Gitee IKFDA8 回归：Response / Request 的 body 消费方法必须异步失败。
 *
 * 迁移前 `consume()` 在 `Promise.resolve(operation(...))` 里同步执行
 * operation，`JSON.parse` 的 SyntaxError 从 `r.json()` 调用点直接抛出，
 * 而不是返回 rejected promise。`bodyUsed` 语义不变（同步置位）。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

let sandboxPromise = null;

function sandbox() {
  sandboxPromise ??= (async () => {
    const { createSandbox } = await import('../src/public/create-sandbox.js');
    return createSandbox('https://body.test/', {
      page: { html: '<!doctype html><html><head></head><body></body></html>' },
      limits: { timeoutMs: 30_000 },
    });
  })();
  return sandboxPromise;
}

test.after(async () => {
  if (sandboxPromise === null) return;
  const instance = await sandboxPromise;
  await instance.close();
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  createSandbox.drain();
});

test('response.json() rejects instead of throwing on invalid JSON', async () => {
  const instance = await sandbox();
  const result = JSON.parse(await instance.run(`(async () => {
    const response = new Response('not-json');
    let syncThrow = null;
    let promise = null;
    try {
      promise = response.json();
    } catch (error) {
      syncThrow = error.constructor.name;
    }
    const bodyUsedSync = response.bodyUsed;
    const isPromise = promise !== null
      && typeof promise.then === 'function'
      && promise instanceof Promise;
    let rejectionName = null;
    if (promise !== null) {
      await promise.then(
        () => { rejectionName = null; },
        error => { rejectionName = error.constructor.name; },
      );
    }
    const valid = await new Response('{"a":1}').json();
    const request = new Request('https://api.test/', { method: 'POST', body: 'nope' });
    let requestPromise = null;
    let requestSyncThrow = null;
    try {
      requestPromise = request.json();
    } catch (error) {
      requestSyncThrow = error.constructor.name;
    }
    const requestUsedSync = request.bodyUsed;
    let requestRejectionName = null;
    if (requestPromise !== null) {
      await requestPromise.catch(error => { requestRejectionName = error.constructor.name; });
    }
    return JSON.stringify({
      syncThrow,
      isPromise,
      bodyUsedSync,
      rejectionName,
      a: valid.a,
      requestSyncThrow,
      requestUsedSync,
      requestRejectionName,
    });
  })()`));

  assert.equal(result.syncThrow, null, 'json() 不得同步抛');
  assert.equal(result.isPromise, true, 'json() 必须返回 Promise');
  assert.equal(result.bodyUsedSync, true, 'bodyUsed 在调用后立即为 true');
  assert.equal(result.rejectionName, 'SyntaxError', '非法 JSON 应以 SyntaxError reject');
  assert.equal(result.a, 1, '合法 JSON 正常解析');
  assert.equal(result.requestSyncThrow, null, 'Request.json() 不得同步抛');
  assert.equal(result.requestUsedSync, true);
  assert.equal(result.requestRejectionName, 'SyntaxError');
});
