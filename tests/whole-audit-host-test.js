import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createNv8, fullPreset, workerPlugin } from '../src/index.js';
import { createApp } from '../src/engine/core/app.js';
import { createPluginRegistry } from '../src/engine/core/plugin-registry.js';
import { createPluginLockPlan } from '../src/engine/core/plugin-lock-plan.js';
import { createRequestPlan } from '../src/collection/request-protocol/request-plan.js';
import { createRuntimeArtifact, serializeArtifact } from '../src/collection/request-protocol/artifact.js';
import { ArtifactSet } from '../src/collection/request-protocol/artifact-set.js';
import { canonicalDigest } from '../src/collection/request-protocol/canonical-json.js';
import { loadEvidenceBundle } from '../src/collection/evidence/loader.js';
import { DEFAULT_LIMITS } from '../src/collection/evidence/schema.js';
import { drainTasks } from './helpers/async-wait.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };
const gate = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };

test('F01 App close rejects late creation and waits for installation rollback', async () => {
  const entered = gate(), release = gate();
  let uninstalled = 0;
  const app = createApp({ trace: false });
  app.registerPlugin({ id: 'gated', version: '1.0.0', async install() {
    entered.resolve(); await release.promise;
  }, uninstall() { uninstalled++; } });
  app.registerProfile({ id: 'test', plugins: ['gated'] });
  const pending = app.createSandbox({ profile: 'test', trace: false });
  const rejected = assert.rejects(pending, { code: 'ERR_NV8_APP_CLOSED' });
  await entered.promise;
  const closing = app.destroy();
  await assert.rejects(app.createSandbox({ profile: 'test' }), { code: 'ERR_NV8_APP_CLOSED' });
  release.resolve();
  await Promise.all([closing, rejected]);
  assert.equal(uninstalled, 1);
  assert.deepEqual(app.getAllSandboxes(), []);
  await app.destroy();
});

test('F02 failed plugin installation unwinds in reverse and isolates sandbox state', async () => {
  const events = [];
  const a = { id: 'a', version: '1.0.0', install() { events.push('a+'); }, uninstall() { events.push('a-'); } };
  const b = { id: 'b', version: '1.0.0', requires: ['a'], install() { events.push('b+'); }, uninstall() { events.push('b-'); } };
  await assert.rejects(createNv8({ logger, plugins: [a, b, { id: 'z', version: '1.0.0', requires: ['b'], install() { throw Error('fixture'); } }] }), /fixture/);
  assert.deepEqual(events, ['a+', 'b+', 'b-', 'a-']);
  const one = await createNv8({ logger, plugins: [a] });
  const two = await createNv8({ logger, plugins: [a] });
  await one.destroy(); await two.destroy();
  assert.equal(events.filter(e => e === 'a+').length, 3);
  assert.equal(a._installed, undefined);
});

test('F03 pending iframe cannot outlive its owner', async () => {
  const entered = gate(), release = gate();
  const instance = await createNv8({ logger, plugins: [...fullPreset, {
    id: 'gated-child', version: '1.0.0', supports: { realms: ['iframe'] }, install() {},
    async activate() { entered.resolve(); await release.promise; },
  }] });
  try {
    const root = await instance.sandbox.createRealm();
    root.evaluate(`const f=document.createElement('iframe');f.srcdoc='<html></html>';document.body.appendChild(f);`);
    await entered.promise;
    await instance.sandbox.destroyRealm(root.id);
    assert.equal(root.destroyed, true);
    release.resolve();
    await drainTasks();
    assert.deepEqual(instance.sandbox.getAllRealms(), []);
  } finally { release.resolve(); await instance.destroy(); }
});

test('F04 plans and artifacts own immutable nested snapshots and reject fake artifacts', () => {
  const value = { nested: [1] }, metadata = { label: 'before' };
  const plan = createRequestPlan({ method: 'POST', url: 'https://fixture.test/', body: { encoding: 'json', value }, metadata });
  const artifact = createRuntimeArtifact({ id: 'data', kind: 'metadata', value, metadata });
  value.nested[0] = 2; metadata.label = 'after';
  assert.equal(plan.body.value.nested[0], 1);
  assert.equal(plan.metadata.label, 'before');
  assert.throws(() => { artifact.value.nested.push(3); }, TypeError);
  assert.equal(canonicalDigest(serializeArtifact(artifact)), artifact.digest);
  assert.throws(() => new ArtifactSet().add(Object.freeze({ id: 'fake', digest: 'fake', byteLength: -1 })));
});

test('F05/F06 evidence exposes verified bytes and independent metadata; enforces UTF8 size', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'nv8-whole-evidence-'));
  try {
    const text = 'globalThis.value=1;';
    const manifest = { schemaVersion: '1.0', bundleId: '审计'.repeat(60), target: {
      url: 'https://fixture.test/', origin: 'https://fixture.test', capturedAt: '2026-09-16T00:00:00.000Z',
    }, entrypoints: ['entry.js'], files: [{ path: 'entry.js', role: 'script', mediaType: 'text/javascript',
      bytes: Buffer.byteLength(text), sha256: createHash('sha256').update(text).digest('hex') }] };
    const raw = JSON.stringify(manifest);
    await writeFile(join(dir, 'entry.js'), text); await writeFile(join(dir, 'manifest.json'), raw);
    await assert.rejects(loadEvidenceBundle(dir, { limits: { ...DEFAULT_LIMITS, maxManifestBytes: raw.length } }));
    const bundle = await loadEvidenceBundle(dir);
    await writeFile(join(dir, 'entry.js'), 'changed');
    assert.equal(await bundle.readFile('entry.js'), text);
    const bytes = await bundle.readFileBuffer('entry.js'); bytes.fill(0);
    assert.equal(await bundle.readFile('entry.js'), text);
    bundle.getEntrypoints().length = 0;
    assert.deepEqual(bundle.getEntrypoints(), ['entry.js']);
    assert.throws(() => { bundle.getFile('entry.js').sha256 = 'wrong'; }, TypeError);
    assert.throws(() => { bundle.manifest.target.url = 'wrong'; }, TypeError);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('F22/F23 dependency contracts honor optional and capability versions and lock semantics', () => {
  const provider = { id: 'provider', version: '1.0.0', provides: [{ name: 'feature', version: '2.0.0' }], install() {} };
  const consumer = { id: 'consumer', version: '1.0.0', requires: [{ id: 'missing', optional: true }, { id: 'feature', version: '^2.0.0' }], install() {} };
  const registry = createPluginRegistry(); registry.register(consumer); registry.register(provider);
  assert.deepEqual(registry.resolve().map(p => p.id), ['provider', 'consumer']);
  const plan = requires => createPluginLockPlan({ plugins: [{ ...consumer, requires }] });
  assert.notEqual(plan([{ id: 'a' }]).digest, plan([{ id: 'b' }]).digest);
  assert.notEqual(plan([{ id: 'a' }]).digest, plan([{ id: 'a', optional: true }]).digest);
  assert.equal(plan(['a@^1.0.0']).digest, plan([{ id: 'a', version: '^1.0.0' }]).digest);
});

test('F19 Core module workers resolve nested imports against each referrer', async () => {
  const instance = await createNv8({ logger, plugins: [...fullPreset, workerPlugin], profile: { id: 'whole-audit-worker', url: 'https://fixture.test/' }, replay: [
    { url: 'https://fixture.test/main.js', body: 'import {value} from "./sub/helper.js";postMessage(value);' },
    { url: 'https://fixture.test/sub/helper.js', body: 'export {value} from "./leaf.js";' },
    { url: 'https://fixture.test/sub/leaf.js', body: 'export const value=42;' },
  ] });
  try { assert.equal(await instance.eval(`new Promise((resolve,reject)=>{const w=new Worker('/main.js',{type:'module'});w.onmessage=e=>resolve(e.data);w.onerror=e=>reject(Error(e.message));})`), 42); }
  finally { await instance.destroy(); }
});
