import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, domPreset } from '../src/index.js';
import { storagePlugin } from '../src/plugins/storage/index.js';
import { navigatorPlugin } from '../src/plugins/navigator/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';
import { windowPlugin } from '../src/plugins/window/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

 test('iframe keeps Navigator and storage state Realm-local', async () => {
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
    const result = await realm.evaluate(`new Promise(resolve => {
      localStorage.setItem('shared', 'parent');
      sessionStorage.setItem('private', 'parent');
      const frame = document.createElement('iframe');
      frame.addEventListener('load', () => {
        const child = frame.contentWindow;
        child.localStorage.setItem('shared', 'child');
        child.sessionStorage.setItem('private', 'child');
        resolve(JSON.stringify({
          navigatorIdentity: navigator === child.navigator,
          localStorageData: localStorage.getItem('shared'),
          sessionStorageData: sessionStorage.getItem('private'),
          childLocalStorageData: child.localStorage.getItem('shared'),
          childSessionStorageData: child.sessionStorage.getItem('private'),
          navigatorUserAgent: child.navigator.userAgent,
        }));
      }, { once: true });
      frame.srcdoc = '<!doctype html><html><body>child</body></html>';
      document.body.appendChild(frame);
    })`);
    assert.deepEqual(JSON.parse(result), {
      navigatorIdentity: false,
      localStorageData: 'parent',
      sessionStorageData: 'parent',
      childLocalStorageData: 'child',
      childSessionStorageData: 'child',
      navigatorUserAgent: 'Gate0 Parent UA',
    });
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
