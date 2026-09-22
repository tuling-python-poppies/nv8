import { CollectorConfigError, CollectorError, CollectorErrorCode } from './errors.js';
import {
  assertCheckpointStore,
  createCheckpoint,
  inspectCheckpoint,
  jobFingerprint,
} from './checkpoint.js';

/**
 * 分页调度器。
 *
 * 限流与熔断回答「这个请求该不该发」，分页调度回答「下一个请求是什么」。
 * 两者是不同的层：前者是策略，后者是遍历。
 *
 * ## 游标提取必须由调用方给
 *
 * 内置「猜下一页」是行不通的：`next_cursor` / `page` / `offset` /
 * `Link: rel=next` / 响应体里某个嵌套字段，各站点都不一样，猜错的代价是静默
 * 少采数据。所以 `nextRequest` 是必需回调——由目标专属的适配器实现。
 *
 * ## 拉取式而不是回调式
 *
 * 暴露 async iterator 而不是 `onPage` 回调：调用方用 `for await` 天然获得
 * 背压（处理完一页才要下一页），也能随时 `break` 提前停止。回调式要额外
 * 设计暂停/恢复协议。
 *
 * ## 三种必须有上限的东西
 *
 * 分页最容易出的事故是「永远转下去」：
 *
 * 1. **页数上限**（`maxPages`）——防御游标一直不为空
 * 2. **游标环检测**——游标重复出现说明目标在绕圈，继续采是浪费
 * 3. **空页容忍**（`maxEmptyPages`）——连续空页说明已经到底或出错
 *
 * 只做第 1 条是不够的：环形游标会在上限内反复采同一页数据，看起来"采到了
 * N 页"但其实全是重复。
 */

/** 停止原因。调用方据此区分"正常采完"和"撞上限了"。 */
export const PaginationStop = Object.freeze({
  EXHAUSTED: 'exhausted',
  MAX_PAGES: 'max-pages',
  MAX_TOTAL_ITEMS: 'max-total-items',
  CURSOR_LOOP: 'cursor-loop',
  EMPTY_PAGES: 'empty-pages',
  ABORTED: 'aborted',
});

const DEFAULT_LIMITS = Object.freeze({
  maxPages: 100,
  maxEmptyPages: 2,
  maxTotalItems: 0,
});

export class PaginationScheduler {
  #collector;
  #nextRequest;
  #extractItems;
  #cursorOf;
  #limits;
  #checkpoint;

  /**
   * @param {object} config
   * @param {object} config.collector 有 `send(plan, options)` 的对象
   * @param {(context:object) => (object|null)} config.nextRequest
   *        返回下一页的 plan 输入；返回 null 表示采完
   * @param {(page:object) => any[]} [config.extractItems] 从一页里取条目，
   *        默认返回空数组（只关心请求序列时不必提供）
   * @param {(page:object) => (string|null)} [config.cursorOf] 取本页游标用于环检测，
   *        默认用请求 URL
   * @param {object} [config.limits]
   */
  constructor(config = {}) {
    const { collector, nextRequest } = config;

    if (collector === null || typeof collector?.send !== 'function') {
      throw new CollectorConfigError(
        'pagination scheduler requires a collector with send()'
      );
    }
    if (typeof nextRequest !== 'function') {
      throw new CollectorConfigError(
        'pagination scheduler requires a nextRequest(context) callback; '
        + 'cursor shapes are target-specific and cannot be guessed'
      );
    }

    const limits = { ...DEFAULT_LIMITS, ...(config.limits ?? {}) };
    assertPositiveInteger('maxPages', limits.maxPages);
    assertNonNegativeInteger('maxEmptyPages', limits.maxEmptyPages);
    assertNonNegativeInteger('maxTotalItems', limits.maxTotalItems);

    this.#collector = collector;
    this.#nextRequest = nextRequest;
    this.#extractItems = config.extractItems ?? (() => []);
    this.#cursorOf = config.cursorOf ?? ((page) => page.request?.url ?? null);
    this.#limits = Object.freeze(limits);
    this.#checkpoint = normalizeCheckpointConfig(config.checkpoint ?? null);
  }

  get limits() { return this.#limits; }
  get checkpointing() { return this.#checkpoint !== null; }

  /**
   * 逐页产出。
   *
   * 每次 yield 一个 `{ index, request, response, items, cursor }`。
   * 迭代结束后用 `result()` 拿汇总，或监听最后一个 yield 的 `stop`。
   *
   * @param {object} [options]
   * @param {AbortSignal} [options.signal]
   * @param {object} [options.seed] 传给首次 nextRequest 的上下文
   * @returns {AsyncGenerator<object>}
   */
  async *pages(options = {}) {
    const signal = options.signal ?? null;
    const seenCursors = new Set();
    let index = 0;
    let emptyStreak = 0;
    let totalItems = 0;
    let previous = null;
    let resumeContext = null;

    // 加载检查点。指纹不匹配（查询条件变了）时当作没有检查点从头开始——
    // 接着旧游标走会产出混合两次查询的数据，且不报错。
    if (this.#checkpoint !== null) {
      const stored = await this.#checkpoint.store.load(this.#checkpoint.jobId);
      const verdict = inspectCheckpoint(stored, this.#checkpoint.fingerprint);
      if (verdict.usable) {
        index = stored.pageIndex;
        totalItems = stored.totalItems;
        resumeContext = stored.resumeContext ?? null;
        for (const cursor of stored.seenCursors ?? []) seenCursors.add(cursor);
      }
      this.#checkpoint.lastVerdict = verdict;
    }

    for (;;) {
      if (signal?.aborted === true) {
        yield this.#stopMarker(index, PaginationStop.ABORTED, totalItems);
        return;
      }

      if (index >= this.#limits.maxPages) {
        yield this.#stopMarker(index, PaginationStop.MAX_PAGES, totalItems);
        return;
      }

      const planInput = await this.#nextRequest({
        index,
        previous,
        seed: options.seed ?? null,
        totalItems,
        // 续采时首轮没有 previous，只能靠检查点存下来的上下文接上
        resumeContext: previous === null ? resumeContext : null,
      });

      if (planInput === null || planInput === undefined) {
        // 正常采完就清掉检查点，否则下次会以为还有进度可续
        if (this.#checkpoint !== null && this.#checkpoint.clearOnFinish) {
          await this.#checkpoint.store.clear(this.#checkpoint.jobId);
        }
        yield this.#stopMarker(index, PaginationStop.EXHAUSTED, totalItems);
        return;
      }

      const result = await this.#collector.send(planInput, { signal });
      const items = toArray(this.#extractItems(result));
      const cursor = this.#cursorOf({ ...result, items });

      // 环检测：游标重复说明目标在绕圈。只靠 maxPages 的话会在上限内
      // 反复采同一页，看起来"采到了 N 页"其实全是重复数据。
      if (cursor !== null && seenCursors.has(cursor)) {
        yield this.#stopMarker(index, PaginationStop.CURSOR_LOOP, totalItems, { cursor });
        return;
      }
      if (cursor !== null) seenCursors.add(cursor);

      totalItems += items.length;
      emptyStreak = items.length === 0 ? emptyStreak + 1 : 0;

      const page = Object.freeze({
        index,
        request: result.request,
        response: result.response,
        items: Object.freeze(items),
        cursor,
        stop: null,
      });
      yield page;

      previous = page;
      index += 1;

      // 每页保存一次。保存在 yield **之后**：yield 之前保存的话，调用方
      // 处理这一页时崩溃，检查点已经前进，那一页的数据就永久丢了。
      if (this.#checkpoint !== null) {
        await this.#checkpoint.store.save(
          this.#checkpoint.jobId,
          createCheckpoint({
            jobFingerprint: this.#checkpoint.fingerprint,
            pageIndex: index,
            totalItems,
            resumeContext: this.#checkpoint.contextOf?.(page) ?? null,
            seenCursors: [...seenCursors],
          })
        );
      }

      if (
        this.#limits.maxEmptyPages > 0
        && emptyStreak >= this.#limits.maxEmptyPages
      ) {
        yield this.#stopMarker(index, PaginationStop.EMPTY_PAGES, totalItems);
        return;
      }
      if (
        this.#limits.maxTotalItems > 0
        && totalItems >= this.#limits.maxTotalItems
      ) {
        // 撞 maxTotalItems 上限 != 目标数据采完：用独立原因，否则调用方
        // 拿到 EXHAUSTED 会误判"数据已采全"。EXHAUSTED 只留给游标自然采完。
        yield this.#stopMarker(index, PaginationStop.MAX_TOTAL_ITEMS, totalItems);
        return;
      }
    }
  }

  #stopMarker(index, reason, totalItems, extra = {}) {
    return Object.freeze({
      index,
      request: null,
      response: null,
      items: Object.freeze([]),
      cursor: null,
      stop: Object.freeze({ reason, totalItems, ...extra }),
    });
  }

  /**
   * 一次跑完并收集全部条目。
   *
   * 便利方法。数据量大时用 `pages()` 逐页处理，避免全量驻留内存。
   *
   * @param {object} [options]
   * @returns {Promise<object>} `{ items, pages, stop }`
   */
  async collectAll(options = {}) {
    const items = [];
    const pages = [];
    let stop = null;

    for await (const page of this.pages(options)) {
      if (page.stop !== null) {
        stop = page.stop;
        break;
      }
      pages.push(page);
      items.push(...page.items);
    }

    if (stop === null) {
      // pages() 总会以 stop 标记收尾；到这里说明调用方提前 break 了迭代器
      stop = { reason: PaginationStop.EXHAUSTED, totalItems: items.length };
    }

    return Object.freeze({
      items: Object.freeze(items),
      pages: Object.freeze(pages),
      stop: Object.freeze(stop),
    });
  }
}

/**
 * 规范化检查点配置。
 *
 * @param {object|null} config
 * @returns {object|null}
 */
function normalizeCheckpointConfig(config) {
  if (config === null) return null;

  const { store, jobId, job } = config;
  assertCheckpointStore(store);
  if (typeof jobId !== 'string' || jobId === '') {
    throw new CollectorConfigError('checkpoint config requires a non-empty jobId');
  }
  if (job === undefined) {
    throw new CollectorConfigError(
      'checkpoint config requires a job descriptor; its fingerprint guards against '
      + 'resuming a changed query onto a stale cursor'
    );
  }

  return {
    store,
    jobId,
    fingerprint: jobFingerprint(job),
    contextOf: config.contextOf ?? null,
    clearOnFinish: config.clearOnFinish !== false,
    lastVerdict: null,
  };
}

function toArray(value) {
  if (Array.isArray(value)) return [...value];
  if (value === null || value === undefined) return [];
  throw new CollectorError(
    CollectorErrorCode.INVALID_PLAN,
    'extractItems must return an array or null',
    { retryable: false }
  );
}

function assertPositiveInteger(name, value) {
  if (!Number.isInteger(value) || value < 1) {
    throw new CollectorConfigError(
      `${name} must be a positive integer, received ${value}`
    );
  }
}

function assertNonNegativeInteger(name, value) {
  if (!Number.isInteger(value) || value < 0) {
    throw new CollectorConfigError(
      `${name} must be a non-negative integer, received ${value}`
    );
  }
}
