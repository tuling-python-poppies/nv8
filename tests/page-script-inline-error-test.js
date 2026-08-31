import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, domPreset } from '../src/index.js';
import { windowPlugin } from '../src/plugins/window/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

test('inline script failure dispatches error and does not abort page construction', async () => {
  const nv8 = await createNv8({
    plugins: [...domPreset, messagingPlugin, windowPlugin],
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile',      url: 'https://example.test/',
      pageHtml: `<!doctype html><html><head>
        <script>
          globalThis.inlineEvents = [];
          const scripts = document.getElementsByTagName('script');
          scripts[0].addEventListener('error', event => inlineEvents.push(event.type));
          throw new Error('inline failure');
        </script>
        <script>globalThis.afterInline = true;</script>
      </head><body></body></html>`,
    },
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const result = realm.evaluate('JSON.stringify([afterInline, inlineEvents])');
    assert.deepEqual(JSON.parse(result), [true, ['error']]);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
