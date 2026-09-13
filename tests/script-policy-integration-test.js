import test from 'node:test';
import assert from 'node:assert/strict';
import { createNv8, domPreset } from '../src/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

async function createPage({ html, replay = [], scriptPolicy }) {
  return createNv8({
    plugins: domPreset,
    profile: {
      id: 'script-policy-test',
      version: '1.0.0',
      name: 'Script Policy Test',
      url: 'https://target.test/',
      pageHtml: html,
    },
    replay,
    runtime: { scriptPolicy },
    logger,
  });
}

test('inline page scripts are rejected when inline execution is disabled', async () => {
  const nv8 = await createPage({
    html: '<!doctype html><script>globalThis.policyValue = "ran";</script>',
    scriptPolicy: { allowInline: false },
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    assert.equal(realm.evaluate('globalThis.policyValue'), undefined);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('module scripts are rejected without disabling classic scripts', async () => {
  const nv8 = await createPage({
    html: '<!doctype html><script>globalThis.classicValue = "ran";</script>'
      + '<script type="module">globalThis.moduleValue = "ran";</script>',
    scriptPolicy: { allowModules: false },
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    assert.equal(realm.evaluate('globalThis.classicValue'), 'ran');
    assert.equal(realm.evaluate('globalThis.moduleValue'), undefined);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('module dependency origins use the same policy boundary', async () => {
  const nv8 = await createPage({
    html: '<!doctype html><script type="module" src="/entry.js"></script>',
    replay: [{
      method: 'GET',
      url: 'https://target.test/entry.js',
      body: 'import "https://evil.test/child.js"; globalThis.moduleValue = "ran";',
    }, {
      method: 'GET',
      url: 'https://evil.test/child.js',
      body: 'export const value = 1;',
    }],
    scriptPolicy: { allowedOrigins: ['https://target.test'] },
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    assert.equal(realm.evaluate('globalThis.moduleValue'), undefined);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
