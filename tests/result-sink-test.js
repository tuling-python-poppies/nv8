/**
 * 采集结果落地
 *
 * 检查点解决「从哪继续」，结果落地解决「采到的东西放哪」。两者必须配套：
 * **续采一定会重复交付条目**（检查点只能记「上一页处理完了」，无法保证
 * 「上一页的条目都已落库」），所以落地端必须能幂等吸收重复。
 *
 * 三个设计要点：
 *
 * 1. **按 key 去重，不按整体相等** —— 条目里常有易变字段（`fetched_at`、
 *    排序分数、A/B 分桶），按整体相等去重等于不去重。
 * 2. **`keyOf` 不给就不去重** —— 猜不出哪个字段是主键，猜错会把两条不同记录
 *    当成同一条，静默丢数据。
 * 3. **NDJSON 而不是 JSON 数组** —— 进程被杀最多留下一个残缺末行，前面全部
 *    有效。JSON 数组写一半就是整个文件不可解析。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import {
  assertResultSink,
  createBatchingResultSink,
  createMemoryResultSink,
  createNdjsonResultSink,
  keyByFields,
  readNdjsonKeys,
} from '../src/collection/collector/result-sink.js';
import { CollectorErrorCode } from '../src/collection/collector/errors.js';

async function withTempDir(body) {
  const directory = await mkdtemp(path.join(tmpdir(), 'nv8-sink-'));
  try {
    return await body(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

// ------------------------------------------------------ 接口校验

test('assertResultSink fails early on an incomplete sink', () => {
  // 接口不全的 sink 会在采集跑到一半才暴露
  assert.throws(
    () => assertResultSink({ write: () => {}, flush: () => {} }),
    (error) => {
      assert.match(error.message, /close\(\)/);
      return true;
    }
  );
  assert.ok(assertResultSink(createMemoryResultSink()));
});

test('the batching sink requires persist and a sane batchSize', () => {
  assert.throws(
    () => createBatchingResultSink({}),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG
  );
  assert.throws(
    () => createBatchingResultSink({ persist: async () => {}, batchSize: 0 }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG
  );
});

// ------------------------------------------------------ 批量

test('items are persisted in batches, not one by one', async () => {
  const batches = [];
  const sink = createBatchingResultSink({
    persist: async (batch) => { batches.push(batch.length); },
    batchSize: 3,
  });

  await sink.write([1, 2, 3, 4, 5, 6, 7]);
  // 逐条写会把 IO 放大到条目数量级
  assert.deepEqual(batches, [3, 3]);

  await sink.close();
  assert.deepEqual(batches, [3, 3, 1], 'close must flush the remainder');
});

test('close flushes buffered items', async () => {
  const sink = createMemoryResultSink({ batchSize: 100 });
  await sink.write([{ id: 1 }, { id: 2 }]);

  assert.equal(sink.items().length, 0, 'still buffered');
  await sink.close();
  // 崩溃会丢缓冲区，所以 close 必须冲干
  assert.equal(sink.items().length, 2);
});

test('close is idempotent', async () => {
  const sink = createMemoryResultSink();
  await sink.write([{ id: 1 }]);
  await sink.close();
  await sink.close();
  assert.equal(sink.items().length, 1);
});

test('writing after close is rejected', async () => {
  const sink = createMemoryResultSink();
  await sink.close();

  await assert.rejects(sink.write([{ id: 1 }]), (error) => {
    assert.equal(error.code, CollectorErrorCode.DISPOSED);
    return true;
  });
});

test('a failing persist does not leave the batch buffered', async () => {
  let calls = 0;
  const sink = createBatchingResultSink({
    persist: async () => {
      calls += 1;
      throw new Error('disk full');
    },
    batchSize: 2,
  });

  await assert.rejects(sink.write([1, 2]), /disk full/);
  // 先清空再写：留着的话下一次 flush 会把同一批再写一遍
  await sink.close();
  assert.equal(calls, 1);
  assert.equal(sink.stats().buffered, 0);
});

// ------------------------------------------------------ 去重

test('duplicates are dropped by key', async () => {
  const sink = createMemoryResultSink({ keyOf: (item) => item.id, batchSize: 2 });

  const accepted = await sink.write([{ id: 1 }, { id: 2 }, { id: 1 }, { id: 3 }]);
  await sink.close();

  assert.equal(accepted, 3);
  assert.deepEqual(sink.items().map((item) => item.id), [1, 2, 3]);
});

test('volatile fields do not defeat deduplication', async () => {
  const sink = createMemoryResultSink({ keyOf: (item) => item.id });

  // 按整体相等去重的话，`fetched_at` 一变就当成新数据
  await sink.write([
    { id: 'x', fetchedAt: 1, score: 0.9 },
    { id: 'x', fetchedAt: 2, score: 0.4 },
  ]);
  await sink.close();

  assert.equal(sink.items().length, 1);
});

test('without keyOf nothing is deduplicated', async () => {
  const sink = createMemoryResultSink();
  await sink.write([{ id: 1 }, { id: 1 }, { id: 1 }]);
  await sink.close();

  // 猜不出主键；猜错会把两条不同记录当成同一条，静默丢数据。
  // 宁可不去重也不猜。
  assert.equal(sink.items().length, 3);
  assert.equal(sink.stats().duplicates, 0);
});

test('knownKeys seeds deduplication for a resumed run', async () => {
  const sink = createMemoryResultSink({
    keyOf: (item) => item.id,
    knownKeys: ['a', 'b'],
  });

  await sink.write([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
  await sink.close();

  // 续采会重新交付边界页的条目——上一轮已落库的 key 要能挡住
  assert.deepEqual(sink.items().map((item) => item.id), ['c']);
  assert.equal(sink.stats().duplicates, 2);
});

test('stats expose duplicate counts as resume-overlap evidence', async () => {
  const sink = createMemoryResultSink({ keyOf: (item) => item.id, batchSize: 2 });
  await sink.write([{ id: 1 }, { id: 1 }, { id: 2 }, { id: 3 }]);
  await sink.close();

  const stats = sink.stats();
  assert.equal(stats.received, 4);
  assert.equal(stats.written, 3);
  assert.equal(stats.duplicates, 1);
  assert.equal(stats.buffered, 0);
});

// ------------------------------------------------------ NDJSON

test('the ndjson sink appends one line per item', async () => {
  await withTempDir(async (directory) => {
    const filePath = path.join(directory, 'nested', 'out.ndjson');
    const sink = createNdjsonResultSink({ filePath, batchSize: 2 });

    await sink.write([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
    await sink.close();

    const lines = (await readFile(filePath, 'utf8')).trim().split('\n');
    assert.deepEqual(lines.map((line) => JSON.parse(line).id), ['a', 'b', 'c']);
  });
});

test('the ndjson sink creates missing directories', async () => {
  await withTempDir(async (directory) => {
    const filePath = path.join(directory, 'a', 'b', 'c', 'out.ndjson');
    const sink = createNdjsonResultSink({ filePath });
    await sink.write([{ id: 1 }]);
    await sink.close();

    assert.ok((await readFile(filePath, 'utf8')).includes('"id":1'));
  });
});

test('the ndjson sink requires a filePath', () => {
  assert.throws(
    () => createNdjsonResultSink({}),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG
  );
});

test('appending twice keeps earlier lines', async () => {
  await withTempDir(async (directory) => {
    const filePath = path.join(directory, 'out.ndjson');

    const first = createNdjsonResultSink({ filePath });
    await first.write([{ id: 1 }]);
    await first.close();

    const second = createNdjsonResultSink({ filePath });
    await second.write([{ id: 2 }]);
    await second.close();

    const lines = (await readFile(filePath, 'utf8')).trim().split('\n');
    // 追加而不是覆盖——续采不该把上一轮的数据抹掉
    assert.equal(lines.length, 2);
  });
});

// ------------------------------------------------------ 读回 key

test('readNdjsonKeys returns an empty set for a missing file', async () => {
  await withTempDir(async (directory) => {
    const result = await readNdjsonKeys({
      filePath: path.join(directory, 'nope.ndjson'),
      keyOf: (item) => item.id,
    });
    // 首次运行没有文件，不该报错
    assert.equal(result.keys.size, 0);
    assert.equal(result.skipped, 0);
  });
});

test('readNdjsonKeys skips a truncated trailing line and counts it', async () => {
  await withTempDir(async (directory) => {
    const filePath = path.join(directory, 'out.ndjson');
    const sink = createNdjsonResultSink({ filePath });
    await sink.write([{ id: 'a' }, { id: 'b' }]);
    await sink.close();

    // 模拟进程被杀：末行只写了一半
    await writeFile(filePath, `${await readFile(filePath, 'utf8')}{"id":"c`, 'utf8');

    const result = await readNdjsonKeys({ filePath, keyOf: (item) => item.id });

    // NDJSON 的价值就在这里：坏一行不影响前面所有行
    assert.deepEqual([...result.keys].sort(), ['a', 'b']);
    assert.equal(result.skipped, 1, 'the caller should know it happened');
  });
});

test('readNdjsonKeys requires keyOf', async () => {
  await assert.rejects(
    readNdjsonKeys({ filePath: 'x' }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG
  );
});

test('a resumed run seeded from disk drops already-written items', async () => {
  await withTempDir(async (directory) => {
    const filePath = path.join(directory, 'out.ndjson');
    const keyOf = (item) => item.id;

    const first = createNdjsonResultSink({ filePath, keyOf });
    await first.write([{ id: 'a' }, { id: 'b' }]);
    await first.close();

    const { keys } = await readNdjsonKeys({ filePath, keyOf });
    const second = createNdjsonResultSink({ filePath, keyOf, knownKeys: keys });
    // 续采重新交付了 b，加上新的 c
    await second.write([{ id: 'b' }, { id: 'c' }]);
    await second.close();

    const lines = (await readFile(filePath, 'utf8')).trim().split('\n');
    assert.deepEqual(lines.map((line) => JSON.parse(line).id), ['a', 'b', 'c']);
    assert.equal(second.stats().duplicates, 1);
  });
});

// ------------------------------------------------------ keyByFields

test('keyByFields ignores field order and extra fields', () => {
  const key = keyByFields(['id', 'version']);

  // 只看列出的字段，易变字段不参与
  assert.equal(
    key({ id: 1, version: 2, fetchedAt: 'x' }),
    key({ version: 2, id: 1, fetchedAt: 'y' })
  );
  assert.notEqual(key({ id: 1, version: 2 }), key({ id: 1, version: 3 }));
});

test('keyByFields treats missing fields as null rather than throwing', () => {
  const key = keyByFields(['id', 'missing']);
  assert.equal(typeof key({ id: 1 }), 'string');
  assert.equal(key({ id: 1 }), key({ id: 1, missing: null }));
});

test('keyByFields requires a non-empty field list', () => {
  // 全字段摘要会把易变字段算进去，等于不去重——所以必须显式列字段
  assert.throws(
    () => keyByFields([]),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG
  );
});
