/**
 * 宿主可信输入（`dispatchTrustedInput`）
 *
 * 真实 Edge 里脚本 `dispatchEvent(new Event('click'))` 产生的
 * `event.isTrusted === false`，只有用户/宿主输入为 true。反爬交互检测
 * （必须在真实点击后才继续的组件）依赖这个区分——NV8 此前没有任何
 * 产生可信事件的入口。
 *
 * 本组锁定：
 * - 脚本派发 false、宿主 `dispatchTrustedInput` true，且冒泡到 window；
 * - 非输入类型（`error` / `custom-event`）拒绝——信任位不能借给任意事件；
 * - 键盘事件可带 `key` / `code` 初始化；
 * - 快速包装器与全量 API 都有这个方法。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

let sandboxPromise = null;

function sandbox() {
  sandboxPromise ??= (async () => {
    const { createSandbox } = await import('../src/public/create-sandbox.js');
    return createSandbox('https://trusted-input.test/', {
      page: {
        html: '<!doctype html><html><body><button id="b">x</button></body></html>',
      },
    });
  })();
  return sandboxPromise;
}

async function run(source) {
  const instance = await sandbox();
  return instance.run(source);
}

test.after(async () => {
  if (sandboxPromise === null) return;
  const instance = await sandboxPromise;
  await instance.close();
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  createSandbox.drain();
});

test('host-dispatched clicks are trusted, script-dispatched are not', async () => {
  const instance = await sandbox();
  await run(`
    globalThis.__trusted = [];
    addEventListener('click', event => __trusted.push(event.isTrusted));
    dispatchEvent(new Event('click'));
  `);
  const dispatched = await instance.dispatchTrustedInput('click');
  assert.equal(dispatched, true);

  const seen = JSON.parse(await run('JSON.stringify(__trusted)'));
  assert.deepEqual(seen, [false, true]);
});

test('unsupported input types are rejected', async () => {
  const instance = await sandbox();
  // 跨进程边界后错误对象是重建的，断言 name/message 而不是 instanceof。
  await assert.rejects(
    instance.dispatchTrustedInput('custom-event'),
    (error) => error.name === 'TypeError'
      && /unsupported input type/.test(error.message),
  );
  await assert.rejects(
    instance.dispatchTrustedInput('error'),
    (error) => error.name === 'TypeError'
      && /unsupported input type/.test(error.message),
  );
  await assert.rejects(
    instance.dispatchTrustedInput(''),
    (error) => error.name === 'TypeError',
  );
});

test('keyboard input carries key and code and reaches window listeners', async () => {
  const instance = await sandbox();
  await run(`
    globalThis.__keys = [];
    addEventListener('keydown', event => {
      __keys.push([event.key, event.code, event.isTrusted]);
    });
  `);
  await instance.dispatchTrustedInput('keydown', { key: 'Enter', code: 'Enter' });

  const keys = JSON.parse(await run('JSON.stringify(__keys)'));
  assert.deepEqual(keys, [['Enter', 'Enter', true]]);
});

test('the event targets the active element and bubbles from it', async () => {
  const instance = await sandbox();
  await run(`
    globalThis.__phases = null;
    const button = document.querySelector('#b');
    button.focus();
    button.addEventListener('click', event => {
      __phases = { trusted: event.isTrusted, phase: event.eventPhase, target: event.target.id };
    });
  `);
  await instance.dispatchTrustedInput('click');

  const observed = JSON.parse(await run('JSON.stringify(__phases)'));
  assert.deepEqual(observed, { trusted: true, phase: 2, target: 'b' });
});

test('both the quick wrapper and the full API expose the method', async () => {
  const instance = await sandbox();
  assert.equal(typeof instance.dispatchTrustedInput, 'function');
  assert.equal(typeof instance.raw.dispatchTrustedInput, 'function');
});
