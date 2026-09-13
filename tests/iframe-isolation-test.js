import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, domPreset } from '../src/index.js';
import { storagePlugin } from '../src/plugins/storage/index.js';
import { navigatorPlugin } from '../src/plugins/navigator/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';
import { windowPlugin } from '../src/plugins/window/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

// 同源 iframe 的存储按 docs/state-scope.md 是 origin 作用域：localStorage /
// sessionStorage 与父页面互通（同一底层记录）。Navigator 仍然 per-Realm。
 test('same-origin iframe shares storage but keeps Navigator Realm-local', async () => {
  const nv8 = await createNv8({
    plugins: [
      ...domPreset,
      storagePlugin,
      navigatorPlugin,
      messagingPlugin,
      windowPlugin,
    ],
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile',      url: 'https://example.test/',
      navigator: {
        userAgent: 'Gate0 Parent UA',
        language: 'en-US',
        languages: ['en-US'],
      },
    },
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const result = JSON.parse(await realm.evaluate(`new Promise(resolve => {
      localStorage.setItem('shared', 'parent');
      sessionStorage.setItem('private', 'parent');
      document.cookie = 'c_shared=parent; Path=/';
      const frame = document.createElement('iframe');
      frame.addEventListener('load', () => {
        const child = frame.contentWindow;
        child.localStorage.setItem('shared', 'child');
        child.sessionStorage.setItem('private', 'child');
        child.document.cookie = 'c_child=1; Path=/';
        resolve(JSON.stringify({
          navigatorIdentity: navigator === child.navigator,
          localStorageData: localStorage.getItem('shared'),
          sessionStorageData: sessionStorage.getItem('private'),
          childLocalStorageData: child.localStorage.getItem('shared'),
          childSessionStorageData: child.sessionStorage.getItem('private'),
          navigatorUserAgent: child.navigator.userAgent,
          parentCookie: document.cookie,
          childCookie: child.document.cookie,
        }));
      }, { once: true });
      frame.srcdoc = '<!doctype html><html><body>child</body></html>';
      document.body.appendChild(frame);
    })`));
    assert.equal(result.navigatorIdentity, false);
    // 同源：子 Realm 的写入父 Realm 可见（origin 作用域）。
    assert.equal(result.localStorageData, 'child');
    assert.equal(result.sessionStorageData, 'child');
    assert.equal(result.childLocalStorageData, 'child');
    assert.equal(result.childSessionStorageData, 'child');
    assert.equal(result.navigatorUserAgent, 'Gate0 Parent UA');
    // cookie 容器按 origin 共享：两侧都能看到对方的写入。
    assert.match(result.parentCookie, /c_shared=parent/);
    assert.match(result.parentCookie, /c_child=1/);
    assert.match(result.childCookie, /c_shared=parent/);
    assert.match(result.childCookie, /c_child=1/);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
