import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { createSandbox } from '../src/public/create-sandbox.js';
import { createNv8, domPreset } from '../src/index.js';
import { streamsPlugin } from '../src/plugins/streams/index.js';
import { storagePlugin } from '../src/plugins/storage/index.js';
import { fetchPlugin } from '../src/plugins/fetch/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';
import { workerPlugin } from '../src/plugins/worker/index.js';
import {
  captureSurfaceSnapshot,
  summarizeSurfaceSnapshot,
} from '../src/baseline/surface.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };
const fixture = JSON.parse(await readFile(
  new URL('../fixtures/baseline/surface.json', import.meta.url),
  'utf8',
));
const url = 'https://example.test/';
const html = '<!doctype html><html><head></head><body></body></html>';
const plugins = [
  ...domPreset,
  streamsPlugin,
  storagePlugin,
  fetchPlugin,
  messagingPlugin,
  workerPlugin,
];

async function assertSurface(mode, evaluate) {
  const snapshot = await captureSurfaceSnapshot(evaluate);
  assert.equal(snapshot.schema, fixture.snapshotSchema);
  const summary = summarizeSurfaceSnapshot(snapshot);
  assert.deepEqual({
    digest: summary.digest,
    globals: summary.globals,
    prototypes: summary.prototypes,
    members: summary.members,
  }, fixture.entries[mode]);
  for (const entry of Object.values(snapshot.prototypes)) {
    assert.ok(Array.isArray(entry.members));
    assert.ok(entry.members.every(member => (
      typeof member.name === 'string'
      && member.descriptor !== null
    )));
  }
}

test('Baseline captures the legacy surface and descriptor baseline', async () => {
  let sandbox;
  try {
    sandbox = await createSandbox(url, { page: { html }, replay: [] });
    await assertSurface('legacy', source => sandbox.run(source));
  } finally {
    await sandbox?.close();
    createSandbox.drain();
  }
});

test('Baseline captures the plugin surface and descriptor baseline', async () => {
  let nv8;
  try {
    nv8 = await createNv8({
      plugins,
      profile: { id: 'baseline-surface', version: '1.0.0', name: 'Baseline Surface', url, pageHtml: html },
      logger,
    });
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: url, pageHtml: html });
    try {
      await assertSurface('plugin', source => realm.evaluate(source));
    } finally {
      await nv8.sandbox.destroyRealm(realm.id);
    }
  } finally {
    await nv8?.destroy();
  }
});
