import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { canonicalDigest } from '../request-protocol/canonical-json.js';
import { CollectorConfigError, CollectorError, CollectorErrorCode } from './errors.js';

/**
 * 采集进度检查点。
 *
 * 分页调度能产出稳定的页序列，但中断之后得从头再来。检查点把「下一页从哪继续」
 * 落到存储里。
 *
 * ## 存储是注入的,不内置数据库
 *
 * Collector 层不该拥有数据库驱动——那会把一个网络出口层变成数据层，也会让
 * 「用 Postgres 还是 SQLite 还是文件」变成框架决定。这里只定义接口，
 * 附带内存与文件两个实现；真实落库由调用方提供。
 *
 * ## 任务指纹:查询变了就不能续采
 *
 * 最危险的续采 bug 是「查询条件改了，却接着旧游标往下走」——结果是一份
 * 混合了两次查询的数据，而且没有任何报错。所以检查点里存任务描述的指纹，
 * 加载时不匹配就当没有检查点。
 *
 * ## 续采一定会有重叠
 *
 * 检查点只能记「上一页处理完了」，无法保证「上一页的条目都已落库」。因此续采
 * 会重新交付一部分条目，去重是**调用方**的责任。假装没有重叠比明说更危险。
 */

/** 检查点结构版本。格式变了就让旧检查点自然失效。 */
export const CHECKPOINT_SCHEMA_VERSION = '1.0';

/**
 * 构造一个检查点。
 *
 * @param {object} input
 * @param {string} input.jobFingerprint
 * @param {number} input.pageIndex 已完成的页数（下一页从这个 index 开始）
 * @param {number} input.totalItems
 * @param {object|null} [input.resumeContext] 交回给 nextRequest 的上下文
 * @param {string[]} [input.seenCursors] 已见游标，用于续采后继续环检测
 * @returns {Readonly<object>}
 */
export function createCheckpoint(input) {
  const {
    jobFingerprint,
    pageIndex,
    totalItems,
    resumeContext = null,
    seenCursors = [],
  } = input ?? {};

  if (typeof jobFingerprint !== 'string' || jobFingerprint === '') {
    throw new CollectorConfigError('checkpoint requires a non-empty jobFingerprint');
  }
  if (!Number.isInteger(pageIndex) || pageIndex < 0) {
    throw new CollectorConfigError(
      `checkpoint pageIndex must be a non-negative integer, received ${pageIndex}`
    );
  }
  if (!Number.isInteger(totalItems) || totalItems < 0) {
    throw new CollectorConfigError(
      `checkpoint totalItems must be a non-negative integer, received ${totalItems}`
    );
  }

  return Object.freeze({
    schema: CHECKPOINT_SCHEMA_VERSION,
    jobFingerprint,
    pageIndex,
    totalItems,
    resumeContext,
    seenCursors: Object.freeze([...seenCursors]),
    savedAt: Date.now(),
  });
}

/**
 * 任务指纹。
 *
 * 用 canonical JSON 而不是 `JSON.stringify`：后者的键顺序取决于对象构造顺序，
 * 同一个查询写成 `{a,b}` 和 `{b,a}` 会得到不同指纹，续采就会莫名失效。
 *
 * @param {any} job 任务描述（查询条件、目标、参数）
 * @returns {string}
 */
export function jobFingerprint(job) {
  return canonicalDigest(job ?? null);
}

/**
 * 校验一个从存储里读回来的检查点是否可用。
 *
 * @param {any} candidate
 * @param {string} expectedFingerprint
 * @returns {{usable: boolean, reason: string|null}}
 */
export function inspectCheckpoint(candidate, expectedFingerprint) {
  if (candidate === null || typeof candidate !== 'object') {
    return { usable: false, reason: 'missing' };
  }
  if (candidate.schema !== CHECKPOINT_SCHEMA_VERSION) {
    return { usable: false, reason: 'schema-mismatch' };
  }
  if (candidate.jobFingerprint !== expectedFingerprint) {
    // 查询条件变了。接着旧游标走会产出混合两次查询的数据，且不报错。
    return { usable: false, reason: 'job-changed' };
  }
  if (!Number.isInteger(candidate.pageIndex) || candidate.pageIndex < 0) {
    return { usable: false, reason: 'corrupt' };
  }
  // pagination 直接使用这两个字段：totalItems 参与上限判断，seenCursors 进入
  // 环检测集合。损坏的值（负数、非整数、非字符串数组）必须在这里挡掉，
  // 否则会在续采时变成静默的数据错误。
  if (!Number.isInteger(candidate.totalItems) || candidate.totalItems < 0) {
    return { usable: false, reason: 'corrupt' };
  }
  if (
    !Array.isArray(candidate.seenCursors)
    || candidate.seenCursors.some((cursor) => typeof cursor !== 'string')
  ) {
    return { usable: false, reason: 'corrupt' };
  }
  return { usable: true, reason: null };
}

/**
 * 内存检查点存储。
 *
 * 测试与单进程短任务用。进程退出即丢失——这是它的定义而不是缺陷。
 *
 * @returns {object}
 */
export function createMemoryCheckpointStore() {
  const entries = new Map();
  return {
    async load(jobId) {
      return entries.get(`${jobId}`) ?? null;
    },
    async save(jobId, checkpoint) {
      entries.set(`${jobId}`, checkpoint);
    },
    async clear(jobId) {
      entries.delete(`${jobId}`);
    },
    /** 仅用于测试断言。 */
    size() {
      return entries.size;
    },
  };
}

/**
 * 文件检查点存储。
 *
 * **原子写**：先写临时文件再 rename。直接覆盖原文件的话，进程在写一半时被杀
 * 会留下一个截断的 JSON——下次加载失败，等于丢掉全部进度。rename 在同一文件
 * 系统内是原子的，最坏情况是读到上一个完整版本。
 *
 * @param {object} config
 * @param {string} config.directory
 * @returns {object}
 */
export function createFileCheckpointStore(config = {}) {
  const directory = config.directory;
  if (typeof directory !== 'string' || directory === '') {
    throw new CollectorConfigError('file checkpoint store requires a directory');
  }

  const fileFor = (jobId) => path.join(directory, `${safeName(jobId)}.checkpoint.json`);

  return {
    async load(jobId) {
      try {
        const raw = await readFile(fileFor(jobId), 'utf8');
        return JSON.parse(raw);
      } catch (error) {
        if (error.code === 'ENOENT') return null;
        if (error instanceof SyntaxError) {
          // 文件损坏时返回 null 而不是抛：损坏的检查点应当导致"重新开始"，
          // 而不是让整个采集任务起不来。
          return null;
        }
        throw new CollectorError(
          CollectorErrorCode.REQUEST_FAILED,
          `failed to read checkpoint for ${jobId}: ${error.message}`,
          { retryable: false, cause: error }
        );
      }
    },

    async save(jobId, checkpoint) {
      await mkdir(directory, { recursive: true });
      const target = fileFor(jobId);
      // 临时名带随机后缀：同一 job 并发保存时不能互相截断
      const temporary = `${target}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
      await writeFile(temporary, `${JSON.stringify(checkpoint, null, 2)}\n`, 'utf8');
      try {
        await rename(temporary, target);
      } catch (error) {
        // rename 失败时清理临时文件，避免目录里累积 .tmp 垃圾
        //（进程在两者之间被杀的残留无法在此处理）。
        try { await unlink(temporary); } catch { /* 临时文件可能已不存在 */ }
        throw error;
      }
    },

    async clear(jobId) {
      try {
        await unlink(fileFor(jobId));
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    },
  };
}

/**
 * 把 jobId 变成安全的文件名。
 *
 * jobId 常来自 URL 或查询条件，可能含 `/`、`..`、`:`。不处理的话
 * `../../etc/x` 会写到目录外。
 *
 * @param {string} jobId
 * @returns {string}
 */
function safeName(jobId) {
  const text = `${jobId}`;
  const sanitized = text.replace(/[^a-zA-Z0-9._-]/gu, '_').slice(0, 100);
  // 附上原串的摘要：清洗会让不同 jobId 撞名（`a/b` 与 `a_b`），
  // 摘要保证一一对应
  return `${sanitized}-${canonicalDigest(text).slice(0, 12)}`;
}

/**
 * 校验一个对象是否满足存储接口。
 *
 * 早失败：接口不全的存储会在采集跑到一半时才暴露。
 *
 * @param {any} store
 * @returns {object}
 */
export function assertCheckpointStore(store) {
  for (const method of ['load', 'save', 'clear']) {
    if (typeof store?.[method] !== 'function') {
      throw new CollectorConfigError(
        `checkpoint store must implement ${method}()`
      );
    }
  }
  return store;
}
