import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, domPreset } from '../src/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

test('parser document.write inserts at the current script position and executes nested scripts', async () => {
  const nv8 = await createNv8({
    plugins: domPreset,
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile',      url: 'https://example.test/',
      pageHtml: `<!doctype html><html><body>
        <p id="before">before</p>
        <script>
          globalThis.parserWriteOrder = ['outer'];
          document.write('<span id="first">first</span><script>parserWriteOrder.push("nested");<\\/script><span id="second">second</span>');
        </script>
        <script>parserWriteOrder.push('trailing');</script>
        <p id="after">after</p>
      </body></html>`,
    },
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const result = realm.evaluate(`JSON.stringify({
      order: parserWriteOrder,
      ids: Array.from(document.body.children).map(node => node.id || node.localName),
      currentScript: document.currentScript,
    })`);
    assert.deepEqual(JSON.parse(result), {
      order: ['outer', 'nested', 'trailing'],
      ids: ['before', 'script', 'first', 'script', 'second', 'script', 'after'],
      currentScript: null,
    });
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
