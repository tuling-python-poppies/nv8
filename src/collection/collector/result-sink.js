import { appendFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { canonicalDigest } from '../request-protocol/canonical-json.js';
import { CollectorConfigError, CollectorError, CollectorErrorCode } from './errors.js';

/**
 * 采集结果落地。
 *
 * 检查点解决「从哪继续」，结果落地解决「采到的东西放哪」。两者必须配套，
 * 因为**续采一定会重复交付条目**（检查点只能记「上一页处理完了」，无法保证
 * 「上一页的条目都已落库」）。所以落地端必须能幂等吸收重复。
 *
 * ## 按 key 去重,不按整体相等
 *
 * 条目里常有易变字段（`fetched_at`、排序分数、A/B 分桶），按整体相等去重会把
 * 同一条数据当成新数据反复写入。所以去重按**调用方指定的 key**。
 *
 * `keyOf` 不提供就不去重——猜不出哪个字段是主键，猜错的后果是静默丢数据
 * （把两条不同的记录当成同一条）。宁可不去重也不猜。
 *
 * ## 批量写,但 close 必须冲干
 *
 * 逐条写会把 IO 放大到条目数量级。缓冲到 `batchSize` 再写。
 * 代价是崩溃会丢掉缓冲区里的条目——所以 `close()` 必须冲干，
 * 且调用方应当在检查点保存**之前**冲干（先落数据，再前进游标）。
 *
 * ## NDJSON 而不是 JSON 数组
 *
 * 追加一行就是一条记录，进程被杀最多留下一个残缺的末行，前面全部有效。
 * JSON 数组要维护收尾的 `]`，写一半就是整个文件不可解析。
 */

const DEFAULT_BATCH_SIZE = 200;

/**
 * 校验一个对象是否满足落地接口。
 *
 * 早失败：接口不全的 sink 会在采集跑到一半时才暴露。
 *
 * @param {any} sink
 * @returns {object}
 */
export function assertResultSink(sink) {
  for (const method of ['write', 'flush', 'close']) {
    if (typeof sink?.[method] !== 'function') {
      throw new CollectorConfigError(`result sink must implement ${method}()`);
    }
  }
  return sink;
}

/**
 * 包一层批量与去重。
 *
 * 真正的写入交给 `persist(batch)`——那是存储相关的部分。批量、去重、
 * 统计这些与存储无关的逻辑集中在这里，不必每个实现重写一遍。
 *
 * @param {object} config
 * @param {(batch:any[]) => Promise<void>} config.persist
 * @param {(item:any) => string} [config.keyOf] 不给则不去重
 * @param {number} [config.batchSize=200]
 * @param {Iterable<string>} [config.knownKeys] 已落库的 key，用于续采去重
 * @returns {object}
 */
export function createBatchingResultSink(config = {}) {
  const { persist } = config;
  if (typeof persist !== 'function') {
    throw new CollectorConfigError('batching result sink requires persist(batch)');
  }

  const batchSize = config.batchSize ?? DEFAULT_BATCH_SIZE;
  if (!Number.isInteger(batchSize) || batchSize < 1) {
    throw new CollectorConfigError(
      `batchSize must be a positive integer, received ${batchSize}`
    );
  }

  const keyOf = config.keyOf ?? null;
  // `seen` 只表示已经成功持久化或由调用方声明已存在的 key。
  // 正在等待落地的 key 单独放在 `pendingKeys`：persist 失败时必须释放它们，
  // 否则调用方重试同一批会被误判为重复，造成静默丢数据。
  const seen = keyOf === null ? null : new Set(config.knownKeys ?? []);
  const pendingKeys = keyOf === null ? null : new Set();
  let buffer = [];
  let bufferKeys = [];
  let closed = false;
  const stats = { received: 0, written: 0, duplicates: 0, batches: 0 };

  async function flushBuffer() {
    if (buffer.length === 0) return;
    const batch = buffer;
    const batchKeys = bufferKeys;
    // 先清空再写：persist 抛错时缓冲区不该留着重复内容，
    // 否则下一次 flush 会把同一批再写一遍。key 仍保留在 pendingKeys，
    // 失败分支会释放它们，允许调用方安全重试。
    buffer = [];
    bufferKeys = [];
    try {
      await persist(batch);
    } catch (error) {
      if (pendingKeys !== null) {
        for (const key of batchKeys) pendingKeys.delete(key);
      }
      throw error;
    }
    if (seen !== null) {
      for (const key of batchKeys) {
        pendingKeys.delete(key);
        seen.add(key);
      }
    }
    stats.written += batch.length;
    stats.batches += 1;
  }

  return {
    /**
     * 写入若干条目。返回实际接受的条数（去重后）。
     *
     * @param {Iterable<any>} items
     * @returns {Promise<number>}
     */
    async write(items) {
      if (closed) {
        throw new CollectorError(
          CollectorErrorCode.DISPOSED,
          'result sink is closed',
          { retryable: false }
        );
      }

      let accepted = 0;
      for (const item of items) {
        stats.received += 1;
        let key = null;
        if (seen !== null) {
          key = `${keyOf(item)}`;
          if (seen.has(key) || pendingKeys.has(key)) {
            stats.duplicates += 1;
            continue;
          }
          pendingKeys.add(key);
        }
        buffer.push(item);
        if (key !== null) bufferKeys.push(key);
        accepted += 1;
        if (buffer.length >= batchSize) await flushBuffer();
      }
      return accepted;
    },

    async flush() {
      await flushBuffer();
    },

    async close() {
      if (closed) return;
      // 冲干放在置位之前：置位之后再抛错的话缓冲区就永久丢了
      await flushBuffer();
      closed = true;
    },

    get closed() { return closed; },

    /**
     * 统计快照。`duplicates` 是续采重叠的直接证据，值得暴露。
     *
     * @returns {Readonly<object>}
     */
    stats() {
      return Object.freeze({ ...stats, buffered: buffer.length });
    },
  };
}

/**
 * 内存落地。测试与小任务用。
 *
 * @param {object} [config]
 * @returns {object}
 */
export function createMemoryResultSink(config = {}) {
  const items = [];
  const sink = createBatchingResultSink({
    ...config,
    persist: async (batch) => { items.push(...batch); },
  });
  return Object.assign(sink, {
    /** 已落地的条目。仅用于测试与小任务。 */
    items() { return Object.freeze([...items]); },
  });
}

/**
 * NDJSON 文件落地（追加）。
 *
 * @param {object} config
 * @param {string} config.filePath
 * @param {(item:any) => string} [config.keyOf]
 * @param {number} [config.batchSize]
 * @returns {object}
 */
export function createNdjsonResultSink(config = {}) {
  const { filePath } = config;
  if (typeof filePath !== 'string' || filePath === '') {
    throw new CollectorConfigError('ndjson result sink requires a filePath');
  }

  let directoryReady = false;

  return createBatchingResultSink({
    ...config,
    persist: async (batch) => {
      if (!directoryReady) {
        await mkdir(path.dirname(filePath), { recursive: true });
        directoryReady = true;
      }
      // 一次 appendFile 写整批：逐行 append 会把 IO 放大，
      // 也会让"半批"状态变多
      const payload = batch.map((item) => JSON.stringify(item)).join('\n');
      await appendFile(filePath, `${payload}\n`, 'utf8');
    },
  });
}

/**
 * 从已有的 NDJSON 文件里读回 key 集合，供续采去重。
 *
 * 残缺的末行（进程被杀留下的）会被跳过而不是让整个读取失败——NDJSON 的价值
 * 就在这里：坏一行不影响前面所有行。
 *
 * @param {object} config
 * @param {string} config.filePath
 * @param {(item:any) => string} config.keyOf
 * @returns {Promise<{keys: Set<string>, skipped: number}>}
 */
export async function readNdjsonKeys(config = {}) {
  const { filePath, keyOf } = config;
  if (typeof keyOf !== 'function') {
    throw new CollectorConfigError('readNdjsonKeys requires keyOf(item)');
  }

  let raw;
  try {
    raw = await readFile(filePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return { keys: new Set(), skipped: 0 };
    throw error;
  }

  const keys = new Set();
  let skipped = 0;
  for (const line of raw.split('\n')) {
    if (line.trim() === '') continue;
    try {
      keys.add(`${keyOf(JSON.parse(line))}`);
    } catch {
      // 残缺行只可能出现在末尾；跳过并计数，让调用方知道发生过
      skipped += 1;
    }
  }
  return { keys, skipped };
}

/**
 * 按条目内容生成稳定 key。
 *
 * 没有明确主键时的兜底：对**指定字段**做 canonical 摘要。仍然要求调用方列出
 * 字段——全字段摘要会把易变字段算进去，等于不去重。
 *
 * @param {string[]} fields
 * @returns {(item:any) => string}
 */
export function keyByFields(fields) {
  if (!Array.isArray(fields) || fields.length === 0) {
    throw new CollectorConfigError('keyByFields requires a non-empty field list');
  }
  return (item) => canonicalDigest(
    fields.map((field) => item?.[field] ?? null)
  );
}
