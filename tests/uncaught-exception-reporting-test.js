/**
 * 未捕获异常上报（窗口 `error` 事件）
 *
 * 迁移前事件监听器 / 定时器 / `queueMicrotask` 三个回调边界的 catch 全是
 * 静默注释：异常直接消失。「处理器抛错」与「处理器没被调用」在本地完全同形，
 * 是协议恢复里最贵的一类零信号失败（五秒盾案例踩过：消息处理器被
 * `Illegal invocation` 打断后只剩超时）。
 *
 * 现在按真实 Edge 语义上报：
 *
 * - `ErrorEvent.message` 带 `Uncaught ` 前缀（`Uncaught Error: x`）；
 * - `window.onerror` 走 [SpecialOperation] 五参调用，返回 true 取消默认动作；
 * - 监听器异常不向 `dispatchEvent` 调用方抛出；
 * - error 事件处理期间再抛出的异常不再递归上报（坏 onerror 不会自激）。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

let sandboxPromise = null;

function sandbox() {
  sandboxPromise ??= (async () => {
    const { createSandbox } = await import('../src/public/create-sandbox.js');
    return createSandbox('https://error-reporting.test/', {
      page: {
        html: '<!doctype html><html><body><button id="b">x</button></body></html>',
      },
    });
  })();
  return sandboxPromise;
}

async function evaluate(source) {
  const instance = await sandbox();
  return JSON.parse(await instance.run(`JSON.stringify((() => { ${source} })())`));
}

test.after(async () => {
  if (sandboxPromise === null) return;
  const instance = await sandboxPromise;
  await instance.close();
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  createSandbox.drain();
});

test('a throwing listener is reported as a window error event', async () => {
  const observed = await evaluate(`
    const seen = [];
    const onError = event => seen.push({
      type: event.type,
      message: event.message,
      sameError: event.error instanceof Error
        && event.error.message === 'listener-probe',
    });
    addEventListener('error', onError);
    const button = document.querySelector('#b');
    const handler = () => { throw new Error('listener-probe') };
    button.addEventListener('click', handler);
    button.dispatchEvent(new Event('click'));
    button.removeEventListener('click', handler);
    removeEventListener('error', onError);
    return seen;
  `);

  assert.deepEqual(observed, [{
    type: 'error',
    message: 'Uncaught Error: listener-probe',
    sameError: true,
  }]);
});

test('a throwing listener does not propagate out of dispatchEvent', async () => {
  const observed = await evaluate(`
    const button = document.querySelector('#b');
    const handler = () => { throw new Error('swallowed') };
    button.addEventListener('click', handler);
    let dispatched;
    try {
      dispatched = button.dispatchEvent(new Event('click'));
    } catch {
      dispatched = 'threw';
    }
    button.removeEventListener('click', handler);
    return dispatched;
  `);

  assert.equal(observed, true, 'dispatchEvent returns !defaultPrevented');
});

test('window.onerror receives the five-argument Edge signature', async () => {
  const observed = await evaluate(`
    const calls = [];
    const previous = window.onerror;
    window.onerror = function (message, filename, lineno, colno, error) {
      calls.push([
        message,
        typeof filename,
        lineno,
        colno,
        error instanceof Error ? error.message : String(error),
      ]);
      return true;
    };
    const button = document.querySelector('#b');
    const handler = () => { throw new Error('five-args') };
    button.addEventListener('click', handler);
    button.dispatchEvent(new Event('click'));
    button.removeEventListener('click', handler);
    window.onerror = previous;
    return calls;
  `);

  assert.equal(observed.length, 1);
  assert.equal(observed[0][0], 'Uncaught Error: five-args');
  assert.equal(observed[0][1], 'string', 'filename is a string');
  assert.equal(
    Number.isInteger(observed[0][2]) && observed[0][2] >= 1,
    true,
    'lineno comes from the throw site',
  );
  assert.equal(typeof observed[0][3], 'number');
  assert.equal(observed[0][4], 'five-args');
});

test('throwing inside an error handler does not recurse into reporting', async () => {
  const observed = await evaluate(`
    let errorEvents = 0;
    const onError = () => { errorEvents += 1; throw new Error('handler-probe') };
    addEventListener('error', onError);
    const button = document.querySelector('#b');
    const handler = () => { throw new Error('outer-probe') };
    button.addEventListener('click', handler);
    button.dispatchEvent(new Event('click'));
    button.removeEventListener('click', handler);
    removeEventListener('error', onError);
    return errorEvents;
  `);

  assert.equal(observed, 1, 'a broken error handler must not self-amplify');
});

test('timer callback exceptions are reported as error events', async () => {
  const message = await sandbox().then(instance => instance.run(`
    new Promise(resolve => {
      addEventListener('error', event => resolve(event.message), { once: true });
      setTimeout(() => { throw new Error('timer-probe') }, 0);
    })
  `));

  assert.equal(message, 'Uncaught Error: timer-probe');
});

test('queueMicrotask exceptions are reported as error events', async () => {
  const message = await sandbox().then(instance => instance.run(`
    new Promise(resolve => {
      addEventListener('error', event => resolve(event.message), { once: true });
      queueMicrotask(() => { throw new Error('microtask-probe') });
    })
  `));

  assert.equal(message, 'Uncaught Error: microtask-probe');
});
