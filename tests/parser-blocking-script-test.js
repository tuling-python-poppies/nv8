import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, domPreset } from '../src/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

test('parser-blocking external classic scripts observe only the parsed prefix', async () => {
  const nv8 = await createNv8({
    plugins: domPreset,
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile',      url: 'https://example.test/',
      pageHtml: `<!doctype html><html><body>
        <p id="before">before</p>
        <script src="/blocking-parser.js"></script>
        <p id="after">after</p>
      </body></html>`,
    },
    replay: [{
      method: 'GET',
      url: 'https://example.test/blocking-parser.js',
      body: `globalThis.parserRuns = (globalThis.parserRuns ?? 0) + 1;
        globalThis.parserSnapshots = [...(globalThis.parserSnapshots ?? []), document.getElementById('after')?.textContent ?? null];
        globalThis.parserPrefix = JSON.stringify({
          before: document.getElementById('before')?.textContent ?? null,
          after: document.getElementById('after')?.textContent ?? null,
          currentScript: document.currentScript?.getAttribute('src') ?? null,
        });`,
    }],
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    assert.equal(realm.evaluate('parserRuns'), 1);
    assert.deepEqual(JSON.parse(realm.evaluate('JSON.stringify(parserSnapshots)')), [null]);
    assert.deepEqual(JSON.parse(realm.evaluate('parserPrefix')), {
      before: 'before',
      after: null,
      currentScript: '/blocking-parser.js',
    });
    assert.equal(realm.evaluate("document.getElementById('after').textContent"), 'after');
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
