import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, domPreset } from '../src/index.js';
import { windowPlugin } from '../src/plugins/window/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';
import { waitUntil } from './helpers/async-wait.js';

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
    assert.deepEqual(JSON.parse(result), [true, 'https://example.test/', 'complete', false, false]);
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
        if (staged) { resolve('load'); return; }
        staged = true;
        frame.addEventListener('error', () => resolve('error'), { once: true });
        frame.removeAttribute('srcdoc');
        frame.setAttribute('src', 'http://%');
      });
      document.body.appendChild(frame);
    })`);
    // 真实浏览器给 load。文档是否被替换成错误页是另一条已登记差距。
    assert.equal(result, 'load');
  } finally {
    await nv8.sandbox.destroyRealm(realm.id);
    await nv8.destroy();
  }
});

/**
 * 不支持的 scheme：导航整体中止，不派发任何事件。
 *
 * 这里在 append **之前**就把 src 设好，只做一次导航。改成
 * `removeAttribute('srcdoc')` 再 `setAttribute('src')` 会引入第二个混淆项：
 * NV8 对**每次属性变更**都立即导航，中间那次「既无 srcdoc 也无 src」的状态
 * 会先派发一次 blank 的 load；真实浏览器把导航排成任务，两次属性变更被合并
 * 成一次导航。那条差距单独登记，不该混进这个用例。
 */
test('Core iframe unsupported scheme dispatches nothing', async () => {
  const nv8 = await createDomRuntime();
  const realm = await nv8.sandbox.createRealm({ type: 'root' });
  try {
    const result = await realm.evaluate(`new Promise(resolve => {
      const frame = document.createElement('iframe');
      frame.addEventListener('load', () => resolve('unexpected-load'), { once: true });
      frame.addEventListener('error', () => resolve('unexpected-error'), { once: true });
      frame.setAttribute('src', 'nv8-unknown://x');
      document.body.appendChild(frame);
      // 「什么都不发生」只能靠等若干任务之后确认没有事件到达
      setTimeout(() => resolve('no-event'), 120);
    })`);
    assert.equal(result, 'no-event');
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
