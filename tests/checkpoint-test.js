/**
 * 采集进度检查点
 *
 * 分页调度能产出稳定的页序列，但中断之后得从头再来。检查点把「下一页从哪继续」
 * 落到存储里。
 *
 * 三个设计要点：
 *
 * 1. **存储是注入的** —— Collector 层不该拥有数据库驱动。只定义接口，
 *    附带内存与文件两个实现。
 * 2. **任务指纹** —— 查询条件变了却接着旧游标走，会产出混合两次查询的数据
 *    且不报错。这是续采最危险的 bug。
 * 3. **续采一定有重叠** —— 检查点只能记「上一页处理完了」，无法保证「上一页的
 *    条目都已落库」。去重是调用方的责任，假装没有重叠比明说更危险。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import {
  CHECKPOINT_SCHEMA_VERSION,
  assertCheckpointStore,
  createCheckpoint,
  createFileCheckpointStore,
  createMemoryCheckpointStore,
  inspectCheckpoint,
  jobFingerprint,
} from '../src/collection/collector/checkpoint.js';
import { PaginationScheduler, PaginationStop } from '../src/collection/collector/pagination.js';
import { CollectorErrorCode } from '../src/collection/collector/errors.js';

const PAGES = Object.freeze({
  start: { items: ['a', 'b'], next: 'c2' },
  c2: { items: ['c'], next: 'c3' },
  c3: { items: ['d'], next: null },
});

function fakeCollector(sent = []) {
  return {
    sent,
    async send(planInput) {
      sent.push(planInput.url);
      const url = new URL(planInput.url);
      const cursor = url.searchParams.get('cursor') ?? 'start';
      return Object.freeze({
        request: Object.freeze({ url: url.href, method: 'GET' }),
        response: Object.freeze({ status: 200, body: PAGES[cursor] ?? { items: [], next: null } }),
        attempts: Object.freeze([]),
        redirected: false,
      });
    },
  };
}

/** 一个会用 resumeContext 接上游标的调度器。 */
function scheduler({ store, jobId = 'job-1', job = { target: 'list' }, sent = [], ...rest }) {
  return new PaginationScheduler({
    collector: fakeCollector(sent),
    nextRequest: ({ index, previous, resumeContext }) => {
      const cursor = previous !== null
        ? previous.response.body.next
        : (resumeContext?.cursor ?? null);
      if (index === 0 && cursor === null) {
        return { url: 'https://api.test/list', method: 'GET' };
      }
      if (cursor === null || cursor === undefined) return null;
      return { url: `https://api.test/list?cursor=${cursor}`, method: 'GET' };
    },
    extractItems: (result) => result.response.body.items,
    checkpoint: store === undefined ? null : {
      store,
      jobId,
      job,
      contextOf: (page) => ({ cursor: page.response.body.next }),
      ...rest,
    },
  });
}

// ------------------------------------------------------ 检查点结构

test('createCheckpoint validates its inputs', () => {
  assert.throws(() => createCheckpoint({ pageIndex: 0, totalItems: 0 }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG);
  assert.throws(() => createCheckpoint({ jobFingerprint: 'f', pageIndex: -1, totalItems: 0 }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG);
  assert.throws(() => createCheckpoint({ jobFingerprint: 'f', pageIndex: 0, totalItems: -1 }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG);
});

test('jobFingerprint ignores key order', () => {
  // 用 canonical JSON 而不是 JSON.stringify：后者的键顺序取决于对象构造顺序，
  // 同一查询写成 {a,b} 和 {b,a} 会得到不同指纹，续采就会莫名失效
  assert.equal(
    jobFingerprint({ a: 1, b: 2 }),
    jobFingerprint({ b: 2, a: 1 })
  );
  assert.notEqual(jobFingerprint({ a: 1 }), jobFingerprint({ a: 2 }));
});

test('inspectCheckpoint rejects the four unusable shapes', () => {
  const fingerprint = jobFingerprint({ q: 1 });
  const valid = createCheckpoint({ jobFingerprint: fingerprint, pageIndex: 2, totalItems: 5 });

  assert.deepEqual(inspectCheckpoint(valid, fingerprint), { usable: true, reason: null });
  assert.equal(inspectCheckpoint(null, fingerprint).reason, 'missing');
  assert.equal(
    inspectCheckpoint({ ...valid, schema: '0.9' }, fingerprint).reason,
    'schema-mismatch'
  );
  assert.equal(
    inspectCheckpoint(valid, jobFingerprint({ q: 2 })).reason,
    'job-changed'
  );
  assert.equal(
    inspectCheckpoint({ ...valid, pageIndex: -1 }, fingerprint).reason,
    'corrupt'
  );
});

test('assertCheckpointStore fails early on an incomplete store', () => {
  // 接口不全的存储会在采集跑到一半时才暴露
  assert.throws(
    () => assertCheckpointStore({ load: () => null, save: () => {} }),
    (error) => {
      assert.match(error.message, /clear\(\)/);
      return true;
    }
  );
});

// ------------------------------------------------------ 内存存储

test('the memory store round-trips and clears', async () => {
  const store = createMemoryCheckpointStore();
  const checkpoint = createCheckpoint({
    jobFingerprint: 'f', pageIndex: 3, totalItems: 9,
  });

  assert.equal(await store.load('j'), null);
  await store.save('j', checkpoint);
  assert.equal((await store.load('j')).pageIndex, 3);
  await store.clear('j');
  assert.equal(await store.load('j'), null);
});

// ------------------------------------------------------ 文件存储

test('the file store round-trips through disk', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'nv8-checkpoint-'));
  try {
    const store = createFileCheckpointStore({ directory });
    await store.save('job/one', createCheckpoint({
      jobFingerprint: 'f', pageIndex: 4, totalItems: 12,
    }));

    const loaded = await store.load('job/one');
    assert.equal(loaded.pageIndex, 4);
    assert.equal(loaded.schema, CHECKPOINT_SCHEMA_VERSION);

    await store.clear('job/one');
    assert.equal(await store.load('job/one'), null);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('the file store keeps path separators out of the filename', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'nv8-checkpoint-'));
  try {
    const store = createFileCheckpointStore({ directory });
    // jobId 常来自 URL 或查询条件；不清洗的话 `../../etc/x` 会写到目录外
    await store.save('../../escape', createCheckpoint({
      jobFingerprint: 'f', pageIndex: 1, totalItems: 1,
    }));

    const loaded = await store.load('../../escape');
    assert.equal(loaded.pageIndex, 1);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('sanitized job ids that would collide stay distinct', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'nv8-checkpoint-'));
  try {
    const store = createFileCheckpointStore({ directory });
    // 清洗会把 `a/b` 和 `a_b` 变成同一个名字；附加摘要保证一一对应
    await store.save('a/b', createCheckpoint({
      jobFingerprint: 'f', pageIndex: 1, totalItems: 1,
    }));
    await store.save('a_b', createCheckpoint({
      jobFingerprint: 'f', pageIndex: 2, totalItems: 2,
    }));

    assert.equal((await store.load('a/b')).pageIndex, 1);
    assert.equal((await store.load('a_b')).pageIndex, 2);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('a corrupt checkpoint file means "start over", not "crash"', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'nv8-checkpoint-'));
  try {
    const store = createFileCheckpointStore({ directory });
    await store.save('j', createCheckpoint({
      jobFingerprint: 'f', pageIndex: 1, totalItems: 1,
    }));

    const [name] = await readdir(directory);
    assert.ok(name, 'the checkpoint file must exist');
    // 模拟写一半被杀：留下一个截断的 JSON
    await writeFile(path.join(directory, name), '{ "schema": "1.0", "pageIn', 'utf8');

    // 损坏的检查点应当导致"重新开始"，而不是让整个采集任务起不来
    assert.equal(await store.load('j'), null);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('the file store rejects a missing directory at construction', () => {
  assert.throws(
    () => createFileCheckpointStore({}),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG
  );
});

test('saving leaves no temporary files behind', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'nv8-checkpoint-'));
  try {
    const store = createFileCheckpointStore({ directory });
    for (let index = 0; index < 5; index += 1) {
      await store.save('j', createCheckpoint({
        jobFingerprint: 'f', pageIndex: index, totalItems: index,
      }));
    }

    const names = await readdir(directory);
    // 原子写用临时文件 + rename；临时文件残留说明 rename 没走通
    assert.deepEqual(names.filter((name) => name.endsWith('.tmp')), []);
    assert.equal(names.length, 1);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

// ------------------------------------------------------ 与分页调度联动

test('checkpoint config requires a job descriptor and explains why', () => {
  const store = createMemoryCheckpointStore();
  assert.throws(
    () => new PaginationScheduler({
      collector: fakeCollector(),
      nextRequest: () => null,
      checkpoint: { store, jobId: 'j' },
    }),
    (error) => {
      assert.match(error.message, /resuming a changed query onto a stale cursor/);
      return true;
    }
  );
});

test('an interrupted walk resumes from the saved page', async () => {
  const store = createMemoryCheckpointStore();
  const firstSent = [];

  let handled = 0;
  for await (const page of scheduler({ store, sent: firstSent }).pages()) {
    if (page.stop !== null) break;
    handled += 1;
    if (handled === 2) break;
  }

  assert.deepEqual(firstSent, [
    'https://api.test/list',
    'https://api.test/list?cursor=c2',
  ]);

  const secondSent = [];
  const resumed = await scheduler({ store, sent: secondSent }).collectAll();

  // 续采不该从头再来
  assert.equal(secondSent[0], 'https://api.test/list?cursor=c2');
  assert.deepEqual([...resumed.items], ['c', 'd']);
  assert.equal(resumed.stop.reason, PaginationStop.EXHAUSTED);
});

test('the checkpoint advances only after a page is fully yielded', async () => {
  const store = createMemoryCheckpointStore();

  for await (const page of scheduler({ store }).pages()) {
    if (page.stop !== null) break;
    // 在处理第 0 页时"崩溃"
    break;
  }

  // 保存必须在 yield **之后**：yield 之前保存的话，调用方处理这一页时崩溃、
  // 检查点已前进，那一页的数据就永久丢了
  assert.equal(await store.load('job-1'), null);
});

test('resuming re-delivers the boundary page instead of skipping it', async () => {
  const store = createMemoryCheckpointStore();

  const firstItems = [];
  let handled = 0;
  for await (const page of scheduler({ store }).pages()) {
    if (page.stop !== null) break;
    firstItems.push(...page.items);
    handled += 1;
    if (handled === 2) break;
  }

  const resumed = await scheduler({ store }).collectAll();

  // 续采一定有重叠：检查点只能记"上一页处理完了"，不能保证"条目都已落库"。
  // 宁可重复交付，也不能跳过。去重是调用方的责任。
  assert.deepEqual(firstItems, ['a', 'b', 'c']);
  assert.deepEqual([...resumed.items], ['c', 'd']);
});

test('a changed job descriptor restarts from scratch', async () => {
  const store = createMemoryCheckpointStore();

  let handled = 0;
  for await (const page of scheduler({ store, job: { q: 'shoes' } }).pages()) {
    if (page.stop !== null) break;
    handled += 1;
    if (handled === 2) break;
  }
  assert.notEqual(await store.load('job-1'), null);

  const sent = [];
  const changed = await scheduler({ store, job: { q: 'boots' }, sent }).collectAll();

  // 接着旧游标走会产出混合两次查询的数据，且不报错——必须从头开始
  assert.equal(sent[0], 'https://api.test/list');
  assert.deepEqual([...changed.items], ['a', 'b', 'c', 'd']);
});

test('finishing a walk clears the checkpoint', async () => {
  const store = createMemoryCheckpointStore();
  await scheduler({ store }).collectAll();

  // 留着会让下次以为还有进度可续
  assert.equal(await store.load('job-1'), null);
});

test('clearOnFinish false keeps the checkpoint for inspection', async () => {
  const store = createMemoryCheckpointStore();
  await scheduler({ store, clearOnFinish: false }).collectAll();

  const kept = await store.load('job-1');
  assert.notEqual(kept, null);
  assert.equal(kept.totalItems, 4);
});

test('seen cursors survive a resume so loop detection still works', async () => {
  const store = createMemoryCheckpointStore();

  let handled = 0;
  for await (const page of scheduler({ store }).pages()) {
    if (page.stop !== null) break;
    handled += 1;
    if (handled === 2) break;
  }

  const saved = await store.load('job-1');
  // 不带上已见游标的话，续采后环检测会从零开始，绕回旧页也发现不了
  assert.ok(saved.seenCursors.includes('https://api.test/list'));
});

test('checkpointing is opt-in', async () => {
  const withoutStore = scheduler({});
  assert.equal(withoutStore.checkpointing, false);

  const result = await withoutStore.collectAll();
  assert.deepEqual([...result.items], ['a', 'b', 'c', 'd']);
});
