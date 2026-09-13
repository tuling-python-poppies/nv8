import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, domPreset } from '../src/index.js';
import { windowPlugin } from '../src/plugins/window/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';
import { drainTasks, waitUntil } from './helpers/async-wait.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

async function createDomRuntime() {
  return createNv8({
    plugins: [...domPreset, messagingPlugin, windowPlugin],
    profile: { id: 'iframe-baseline', version: '1.0.0', name: 'Test Profile', url: 'https://example.test/' },
    logger,
  });
}

test('Core iframe creates same-origin child Realm and contentDocument', async () => {
  const nv8 = await createDomRuntime();
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const result = await realm.evaluate(`new Promise(resolve => {
      const frame = document.createElement('iframe');
      frame.addEventListener('load', () => resolve(JSON.stringify([
        frame.contentWindow === frame.contentDocument.defaultView,
        frame.contentDocument.URL,
        frame.contentDocument.readyState,
        frame.contentWindow.parent === window,
        frame.contentWindow.top === window,
      ])));
      frame.srcdoc = '<!doctype html><html><body><main id="child">child</main></body></html>';
      document.body.appendChild(frame);
    })`);
    // 最后两项原先写的是 `false, false`——那是把缺陷当成契约。同源子帧的
    // `parent` / `top` 在真实浏览器里就是父窗口**本身**，见 ADR-0007。
    assert.deepEqual(JSON.parse(result), [true, 'about:srcdoc', 'complete', true, true]);
    assert.equal(nv8.sandbox.inspect().realms.length, 2);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

/**
 * 畸形 URL 与不支持的 scheme 在真实浏览器里行为**不同**，而且都**不派发
 * `error`**。
 *
 * 实测真实 Edge（先用 srcdoc 载入文档，再改 src）：
 *
 * ```
 * src="http://%"           → 派发 load，旧文档被替换
 * src="nv8-unknown://x"    → 不派发任何事件，旧文档保留
 * ```
 *
 * 迁移前两种都派发 `error`。iframe 在导航失败时派发 error 是可检测偏差——
 * 真实浏览器从不这么做。
 */
test('Core iframe malformed src dispatches load, not error', async () => {
  const nv8 = await createDomRuntime();
  const realm = await nv8.sandbox.createRealm({ type: 'root' });
  try {
    const result = await realm.evaluate(`new Promise(resolve => {
      const frame = document.createElement('iframe');
      frame.srcdoc = '<!doctype html><html><body><main id="old">old</main></body></html>';
      let staged = false;
      frame.addEventListener('load', () => {
        if (staged) {
          resolve(JSON.stringify({
            text: frame.contentDocument.body.textContent,
            url: frame.contentDocument.URL,
            error: false,
          }));
          return;
        }
        staged = true;
        frame.addEventListener('error', () => resolve(JSON.stringify({ error: true })), { once: true });
        frame.removeAttribute('srcdoc');
        frame.setAttribute('src', 'http://%');
      });
      document.body.appendChild(frame);
    })`);
    assert.deepEqual(JSON.parse(result), {
      text: '',
      url: 'about:blank',
      error: false,
    });
  } finally {
    await nv8.sandbox.destroyRealm(realm.id);
    await nv8.destroy();
  }
});

/**
 * 不支持的 scheme：导航整体中止，不派发任何事件。
 *
 * 这里在 append **之前**就把 src 设好，只做一次导航——用意是把用例收窄到
 * 「坏 scheme」这一个变量上。
 *
 * 原注释说改成 `removeAttribute('srcdoc')` + `setAttribute('src')` 会引入
 * 「中间 blank 的 load」这个混淆项。**重测后不成立**：同一个同步块里的多次
 * 属性变更已经合并成一次导航，被顶掉的那次既不提交文档也不派事件。
 * 见 `tests/iframe-navigation-coalescing-test.js`。
 */
test('Core iframe unsupported scheme dispatches nothing', async () => {
  const nv8 = await createDomRuntime();
  const realm = await nv8.sandbox.createRealm({ type: 'root' });
  try {
    // 「什么都不发生」是负向断言：没有可等的正向事件。协议改成先记录、再
    // drain 事件循环、最后数事件——被测实现在坏 scheme 上是**同步中止**导航，
    // 所以排一次任务队列就足以让它执行完。
    const attached = await realm.evaluate(`(() => {
      const frame = document.createElement('iframe');
      globalThis.unsupportedSchemeEvents = [];
      frame.addEventListener('load', () => globalThis.unsupportedSchemeEvents.push('load'));
      frame.addEventListener('error', () => globalThis.unsupportedSchemeEvents.push('error'));
      frame.setAttribute('src', 'nv8-unknown://x');
      document.body.appendChild(frame);
      return frame.isConnected;
    })()`);
    assert.equal(attached, true);
    await drainTasks();
    // 跨 realm 的数组原型不同，deepEqual 会假失败；用 JSON 过桥。
    assert.deepEqual(
      JSON.parse(await realm.evaluate('JSON.stringify(globalThis.unsupportedSchemeEvents)')),
      [],
      'unsupported scheme must not dispatch load/error',
    );
  } finally {
    await nv8.sandbox.destroyRealm(realm.id);
    await nv8.destroy();
  }
});

test('Core iframe exposes a cross-origin facade and releases the child Realm', async () => {
  const nv8 = await createDomRuntime();
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const result = await realm.evaluate(`new Promise(resolve => {
      const frame = document.createElement('iframe');
      frame.addEventListener('load', () => {
        try {
          resolve(JSON.stringify([
            frame.contentDocument === null,
            typeof frame.contentWindow.postMessage,
            frame.contentWindow.parent === window,
            frame.contentWindow.location.href,
          ]));
        } catch (error) {
          resolve(JSON.stringify(['error', error.name]));
        }
      });
      frame.src = 'https://other.example.test/frame';
      document.body.appendChild(frame);
    }).catch(error => JSON.stringify(['error', error.name]))`);
    assert.deepEqual(JSON.parse(result), ['error', 'SecurityError']);
    assert.equal(nv8.sandbox.inspect().realms.length, 2);
    realm.evaluate('document.querySelector("iframe").remove()');
    // 子 Realm 销毁是异步的，等 realm 数真的降下来
    await waitUntil(
      () => nv8.sandbox.inspect().realms.length === 1,
      { label: 'child realm teardown after iframe removal' },
    );
    assert.equal(nv8.sandbox.inspect().realms.length, 1);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
