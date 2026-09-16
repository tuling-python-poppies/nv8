import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { createDynamicImporter, MODULE_REPLAY_MISS_CODE } from '../src/engine/realm/dynamic-import.js';

function fixture(entries) {
  const context = vm.createContext(Object.create(null));
  const sources = new Map(Object.entries(entries).map(([name, source]) => [`https://fixture.test/${name}`, source]));
  const importer = createDynamicImporter({ context, defaultReferrer: 'https://fixture.test/',
    resolveSource: url => sources.get(url) ?? null,
  });
  return { context, importer, sources };
}

test('different roots concurrently link a shared transitive graph once', { timeout: 5000 }, async () => {
  const { importer, context } = fixture({
    'a.js': 'import {value} from "./shared.js"; export const result=value;',
    'b.js': 'import {value} from "./shared.js"; export const result=value;',
    'shared.js': 'import {base} from "./base.js"; globalThis.sharedRuns=(globalThis.sharedRuns||0)+1; export const value=base;',
    'base.js': 'export const base=42;',
  });
  try {
    const [a, b, again, shared] = await Promise.all([
      importer('./a.js'), importer('./b.js'), importer('./a.js'), importer('./shared.js'),
    ]);
    assert.equal(a.result, 42);
    assert.equal(b.result, 42);
    assert.equal(shared.value, 42);
    assert.equal(a, again);
    assert.equal(context.sharedRuns, 1);
    assert.equal(importer.cache.size, 4);
  } finally { importer.dispose(); }
});

test('two entry points into a cycle do not deadlock or instantiate twice', { timeout: 5000 }, async () => {
  const { importer } = fixture({
    'left.js': 'import {right} from "./right.js"; export const left="L"; export const other=()=>right;',
    'right.js': 'import {left} from "./left.js"; export const right="R"; export const other=()=>left;',
  });
  try {
    const [left, right] = await Promise.all([importer('./left.js'), importer('./right.js')]);
    assert.equal(left.other(), 'R');
    assert.equal(right.other(), 'L');
    assert.equal(importer.cache.size, 2);
  } finally { importer.dispose(); }
});

test('link queue never waits on evaluation containing nested dynamic imports', { timeout: 5000 }, async () => {
  const { importer } = fixture({
    'a.js': 'const leaf=await import("./leaf.js"); export const result=leaf.value;',
    'b.js': 'import {value} from "./leaf.js"; export const result=value;',
    'leaf.js': 'export const value=42;',
  });
  try {
    const [a, b] = await Promise.all([importer('./a.js'), importer('./b.js')]);
    assert.equal(a.result, 42);
    assert.equal(b.result, 42);
  } finally { importer.dispose(); }
});

test('failed graph does not poison the queue or cached dependencies on retry', { timeout: 5000 }, async () => {
  const { importer, sources, context } = fixture({
    'a.js': 'import {value} from "./shared.js"; export const result=value;',
    'b.js': 'import {value} from "./shared.js"; export const result=value;',
    'shared.js': 'import {base} from "./missing.js"; globalThis.runs=(globalThis.runs||0)+1; export const value=base;',
    'healthy.js': 'export const result=7;',
  });
  try {
    const [failed, healthy] = await Promise.allSettled([importer('./a.js'), importer('./healthy.js')]);
    assert.equal(failed.status, 'rejected');
    assert.equal(failed.reason.code, MODULE_REPLAY_MISS_CODE);
    assert.equal(healthy.status, 'fulfilled');
    assert.equal(healthy.value.result, 7);
    sources.set('https://fixture.test/missing.js', 'export const base=42;');
    const [a, b] = await Promise.all([importer('./a.js'), importer('./b.js')]);
    assert.equal(a.result, 42);
    assert.equal(b.result, 42);
    assert.equal(context.runs, 1);
  } finally { importer.dispose(); }
});

test('disposing while two graphs are queued cancels both without refilling the cache', async () => {
  const { importer } = fixture({ 'a.js': 'export const value=1;', 'b.js': 'export const value=2;' });
  const pending = [importer('./a.js'), importer('./b.js')];
  const settled = Promise.allSettled(pending);
  importer.dispose();
  for (const result of await settled) {
    assert.equal(result.status, 'rejected');
    assert.equal(result.reason.code, 'ERR_NV8_MODULE_EVALUATION_CANCELLED');
  }
  assert.equal(importer.cache.size, 0);
});

test('a previously evaluated dependency failure remains cached after another link fails', async () => {
  const { importer, context } = fixture({
    'failed.js': 'globalThis.runs=(globalThis.runs||0)+1; throw new Error("evaluation failed");',
    'consumer.js': 'import "./failed.js";',
  });
  try {
    await assert.rejects(importer('./failed.js'), /evaluation failed/);
    await assert.rejects(importer('./consumer.js'), /evaluation failed/);
    await assert.rejects(importer('./failed.js'), /evaluation failed/);
    assert.equal(context.runs, 1);
  } finally { importer.dispose(); }
});
