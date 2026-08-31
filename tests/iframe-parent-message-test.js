import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, domPreset } from '../src/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';
import { windowPlugin } from '../src/plugins/window/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };
const plugins = [...domPreset, messagingPlugin, windowPlugin];

async function createRuntime() {
  return createNv8({
    plugins,
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile', url: 'https://example.test/' },
    logger,
  });
}

test('same-origin iframe parent.postMessage preserves child source', async () => {
  const nv8 = await createRuntime();
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const result = await realm.evaluate(`new Promise(resolve => {
      const frame = document.createElement('iframe');
      window.addEventListener('message', event => resolve(JSON.stringify([
        event.data,
        event.origin,
        event.source === frame.contentWindow,
      ])), { once: true });
      frame.addEventListener('load', () => {
        frame.contentWindow.parent.postMessage('from-child', '*');
      }, { once: true });
      frame.srcdoc = '<!doctype html><html><body>child</body></html>';
      document.body.appendChild(frame);
    })`);
    assert.deepEqual(JSON.parse(result), ['from-child', 'https://example.test', true]);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('same-origin iframe parent bridge enforces targetOrigin', async () => {
  const nv8 = await createRuntime();
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const result = await realm.evaluate(`new Promise(resolve => {
      const frame = document.createElement('iframe');
      let received = 0;
      window.addEventListener('message', event => {
        received += 1;
        resolve(JSON.stringify([
          event.data,
          event.origin,
          event.source === frame.contentWindow,
          received,
        ]));
      }, { once: true });
      frame.addEventListener('load', () => {
        frame.contentWindow.parent.postMessage('blocked', 'https://blocked.example.test');
        frame.contentWindow.parent.postMessage('accepted', 'https://example.test');
      }, { once: true });
      frame.srcdoc = '<!doctype html><html><body>child</body></html>';
      document.body.appendChild(frame);
    })`);
    assert.deepEqual(JSON.parse(result), [
      'accepted',
      'https://example.test',
      true,
      1,
    ]);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
