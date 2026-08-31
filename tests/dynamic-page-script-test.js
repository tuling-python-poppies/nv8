import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, domPreset } from '../src/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

test('dynamically inserted page scripts use offline replay and dispatch load/error', async () => {
  const nv8 = await createNv8({
    plugins: domPreset,
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile',      url: 'https://example.test/',
      pageHtml: '<!doctype html><html><head></head><body></body></html>',
    },
    replay: [
      {
        method: 'GET',
        url: 'https://example.test/dynamic.js',
        body: 'globalThis.dynamicScriptValue = "classic";',
      },
      {
        method: 'GET',
        url: 'https://example.test/dynamic-module.js',
        body: 'globalThis.dynamicScriptValue += ":module";',
      },
    ],
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    await realm.evaluate(`(() => new Promise(resolve => {
      globalThis.dynamicScriptValue = '';
      const classic = document.createElement('script');
      const module = document.createElement('script');
      const missing = document.createElement('script');
      classic.src = '/dynamic.js';
      module.type = 'module';
      module.src = '/dynamic-module.js';
      missing.src = '/missing.js';
      let done = 0;
      for (const script of [classic, module, missing]) {
        script.addEventListener('load', () => { done += 1; if (done === 3) resolve(); });
        script.addEventListener('error', () => { done += 1; if (done === 3) resolve(); });
        document.head.appendChild(script);
      }
    }))()`);
    assert.equal(realm.evaluate('dynamicScriptValue'), 'classic:module');
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
