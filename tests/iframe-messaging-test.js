import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, domPreset } from '../src/index.js';
import { windowPlugin } from '../src/plugins/window/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

test('Core iframe delivers parent-to-child postMessage in the child Realm', async () => {
  const nv8 = await createNv8({
    plugins: [...domPreset, messagingPlugin, windowPlugin],
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile', url: 'https://example.test/' },
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const result = await realm.evaluate(`new Promise(resolve => {
      const frame = document.createElement('iframe');
      frame.addEventListener('load', () => {
        frame.contentWindow.addEventListener('message', event => resolve(JSON.stringify([
          event.data,
          event.origin,
          event.source === frame.contentWindow,
        ])));
        frame.contentWindow.postMessage('to-child', '*');
      }, { once: true });
      frame.srcdoc = '<!doctype html><html><body>child</body></html>';
      document.body.appendChild(frame);
    })`);
    assert.deepEqual(JSON.parse(result), ['to-child', 'https://example.test', true]);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('Core iframe src replacement closes the old child and creates one replacement Realm', async () => {
  const nv8 = await createNv8({
    plugins: [...domPreset, messagingPlugin, windowPlugin],
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile', url: 'https://example.test/' },
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const result = await realm.evaluate(`new Promise(resolve => {
      const frame = document.createElement('iframe');
      let firstWindow;
      frame.addEventListener('load', () => {
        if (!firstWindow) {
          firstWindow = frame.contentWindow;
          frame.srcdoc = '<!doctype html><html><body><main id="second">second</main></body></html>';
          return;
        }
        resolve(JSON.stringify([
          firstWindow !== frame.contentWindow,
          frame.contentDocument.querySelector('#second')?.textContent ?? null,
        ]));
      });
      frame.srcdoc = '<!doctype html><html><body><main id="first">first</main></body></html>';
      document.body.appendChild(frame);
    })`);
    assert.deepEqual(JSON.parse(result), [true, 'second']);
    assert.equal(nv8.sandbox.inspect().realms.length, 2);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
