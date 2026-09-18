import { CollectorConfigError, CollectorError, CollectorErrorCode } from './errors.js';
import { cancellableDelay } from './cancellation.js';

/**
 * 按 origin 的限流与并发控制。
 *
 * 熔断是「对方挂了就停」，限流是「对方没挂也别打太快」。两者解决不同问题，
 * 缺任何一个都会出事：只有熔断的话，稳定但脆弱的目标会被打到熔断为止；
 * 只有限流的话，目标彻底挂掉之后还在按节奏敲门。
 *
 * ## 两个独立维度
 *
 * | 维度 | 控制什么 | 配置 |
 * |---|---|---|
 * | 速率 | 单位时间内**发起**多少请求 | `requestsPerSecond` + `burst` |
 * | 并发 | 同时**在飞**多少请求 | `maxConcurrent` |
 *
 * 这两个必须分开。只限速率的话，慢响应会堆积出无限并发；只限并发的话，
 * 快响应会让速率无上限。
 *
 * ## 令牌桶而不是固定间隔
 *
 * 固定间隔（每 200ms 一个）在采集场景下太死：真实浏览器加载一个页面会**并发**
 * 打十几个请求，然后安静几秒。固定间隔会把这种自然的突发拉平成机械的匀速，
 * 反而更像机器人。
 *
 * 令牌桶允许攒够的额度一次性花掉（`burst`），长期速率仍受 `requestsPerSecond`
 * 约束。
 *
 * ## FIFO,不能让排队的被后来的插队
 *
 * 等待队列按到达顺序放行。若按「谁先抢到令牌谁走」，高频调用方会持续插队，
 * 早到的请求可能永远等不到——这在分页采集里会表现为「第一页迟迟不返回」。
 */

const DEFAULT_CONFIG = Object.freeze({
  requestsPerSecond: 0,
  burst: 0,
  maxConcurrent: 0,
  maxQueued: 1_000,
});

export class RateLimiter {
  #requestsPerSecond;
  #burst;
  #maxConcurrent;
  #maxQueued;
  #now;
  #sleep;
  /** origin -> { tokens, lastRefillAt, inFlight, queue: [] } */
  #buckets = new Map();

  /**
   * @param {object} [config]
   * @param {number} [config.requestsPerSecond=0] 0 表示不限速
   * @param {number} [config.burst] 桶容量，默认等于 requestsPerSecond（至少 1）
   * @param {number} [config.maxConcurrent=0] 0 表示不限并发
   * @param {number} [config.maxQueued=1000] 单 origin 排队上限，超过即拒绝
   * @param {() => number} [config.now] 注入时钟便于测试
   * @param {(ms:number)=>Promise<void>} [config.sleep] 注入等待便于测试
   */
  constructor(config = {}) {
    const {
      requestsPerSecond = DEFAULT_CONFIG.requestsPerSecond,
      maxConcurrent = DEFAULT_CONFIG.maxConcurrent,
      maxQueued = DEFAULT_CONFIG.maxQueued,
      now = Date.now,
    } = config;

    if (config.requestsPerMinute !== undefined) {
      throw new CollectorConfigError(
        "rate limiter option is 'requestsPerSecond'; express per-minute rates as a fraction"
      );
    }
    assertNonNegative('requestsPerSecond', requestsPerSecond);
    assertNonNegativeInteger('maxConcurrent', maxConcurrent);
    assertPositiveInteger('maxQueued', maxQueued);

    const burst = config.burst ?? Math.max(1, Math.ceil(requestsPerSecond));
    assertPositiveInteger('burst', burst);

    this.#requestsPerSecond = requestsPerSecond;
    this.#burst = burst;
    this.#maxConcurrent = maxConcurrent;
    this.#maxQueued = maxQueued;
    this.#now = now;
    this.#sleep = config.sleep ?? cancellableDelay;
  }

  get requestsPerSecond() { return this.#requestsPerSecond; }
  get maxConcurrent() { return this.#maxConcurrent; }

  #bucket(origin) {
    let bucket = this.#buckets.get(origin);
    if (bucket === undefined) {
      bucket = {
        tokens: this.#burst,
        lastRefillAt: this.#now(),
        inFlight: 0,
        queue: [],
      };
      this.#buckets.set(origin, bucket);
    }
    return bucket;
  }

  /** 按流逝时间补充令牌。上限是桶容量，攒不出超过 burst 的额度。 */
  #refill(bucket) {
    if (this.#requestsPerSecond <= 0) return;
    const now = this.#now();
    const elapsedMs = now - bucket.lastRefillAt;
    if (elapsedMs <= 0) return;
    bucket.tokens = Math.min(
      this.#burst,
      bucket.tokens + (elapsedMs / 1_000) * this.#requestsPerSecond
    );
    bucket.lastRefillAt = now;
  }

  /** 还需要等多久才有一个令牌。 */
  #waitForTokenMs(bucket) {
    if (this.#requestsPerSecond <= 0) return 0;
    if (bucket.tokens >= 1) return 0;
    const missing = 1 - bucket.tokens;
    return Math.ceil((missing / this.#requestsPerSecond) * 1_000);
  }

  #canProceed(bucket) {
    if (this.#maxConcurrent > 0 && bucket.inFlight >= this.#maxConcurrent) return false;
    if (this.#requestsPerSecond > 0 && bucket.tokens < 1) return false;
    return true;
  }

  /**
   * 取得一个发送许可。返回的函数必须在请求结束后调用以归还并发额度。
   *
   * @param {string} url
   * @param {object} [options]
   * @param {AbortSignal} [options.signal]
   * @returns {Promise<() => void>} release
   */
  async acquire(url, options = {}) {
    const origin = originOf(url);
    const bucket = this.#bucket(origin);
    const signal = options.signal ?? null;

    throwIfAborted(signal);

    if (bucket.queue.length >= this.#maxQueued) {
      throw new CollectorError(
        CollectorErrorCode.RATE_LIMITED,
        `rate limiter queue for ${origin} is full (${this.#maxQueued})`,
        { retryable: true, context: { origin, queued: bucket.queue.length } }
      );
    }

    // 进队列并按 FIFO 等到自己是队首
    const ticket = {};
    bucket.queue.push(ticket);
    try {
      while (bucket.queue[0] !== ticket || !this.#readyFor(bucket)) {
        throwIfAborted(signal);
        // 等待要与 abort **竞速**，不能只在轮询点检查。
        // 否则一次长等待期间 abort 不会生效，调用方看到的是「取消了但还在等」。
        await raceAbort(this.#sleep(this.#nextDelayMs(bucket, ticket), signal), signal);
      }
    } catch (error) {
      removeTicket(bucket, ticket);
      throw error;
    }

    bucket.queue.shift();
    if (this.#requestsPerSecond > 0) bucket.tokens -= 1;
    bucket.inFlight += 1;

    let released = false;
    return () => {
      // 幂等：调用方在 finally 里调，异常路径可能重复触发
      if (released) return;
      released = true;
      bucket.inFlight = Math.max(0, bucket.inFlight - 1);
    };
  }

  #readyFor(bucket) {
    this.#refill(bucket);
    return this.#canProceed(bucket);
  }

  /**
   * 下一轮检查前该等多久。
   *
   * 队首等令牌时按精确时间等；非队首只能轮询——但轮询间隔取队首所需时间，
   * 避免空转。
   */
  #nextDelayMs(bucket, ticket) {
    if (bucket.queue[0] === ticket) {
      const tokenWait = this.#waitForTokenMs(bucket);
      if (tokenWait > 0) return tokenWait;
      // 令牌够了但并发满了：只能等别人 release，没有可算的时刻
      return 1;
    }
    return Math.max(1, this.#waitForTokenMs(bucket));
  }

  /**
   * 包住一次调用，自动 acquire / release。
   *
   * @param {string} url
   * @param {() => Promise<any>} body
   * @param {object} [options]
   * @returns {Promise<any>}
   */
  async run(url, body, options = {}) {
    const release = await this.acquire(url, options);
    try {
      return await body();
    } finally {
      release();
    }
  }

  /**
   * 当前状态快照，用于诊断。
   *
   * @returns {object[]}
   */
  snapshot() {
    return [...this.#buckets.entries()].map(([origin, bucket]) => {
      this.#refill(bucket);
      return Object.freeze({
        origin,
        tokens: Number(bucket.tokens.toFixed(3)),
        inFlight: bucket.inFlight,
        queued: bucket.queue.length,
      });
    });
  }

  /**
   * 清空状态。仅用于测试与运维介入。
   *
   * @param {string} [url] 省略则清空全部
   */
  reset(url) {
    if (url === undefined) {
      this.#buckets.clear();
      return;
    }
    this.#buckets.delete(originOf(url));
  }
}

function removeTicket(bucket, ticket) {
  const index = bucket.queue.indexOf(ticket);
  if (index !== -1) bucket.queue.splice(index, 1);
}

/**
 * 让等待与 abort 竞速。
 *
 * `sleep` 无法被取消（注入的实现可能是任意的），所以这里不取消它，只是不再等它。
 * 被遗弃的 sleep 会自然结束；关键是调用方能立刻拿到 ABORTED。
 *
 * @param {Promise<void>} waiting
 * @param {AbortSignal|null} signal
 * @returns {Promise<void>}
 */
function raceAbort(waiting, signal) {
  if (signal === null) return waiting;
  return new Promise((resolve, reject) => {
    let settled = false;
    const onAbort = () => {
      if (settled) return;
      settled = true;
      signal.removeEventListener?.('abort', onAbort);
      reject(new CollectorError(
        CollectorErrorCode.ABORTED,
        'rate limiter wait aborted',
        { retryable: false }
      ));
    };
    if (signal.aborted) { onAbort(); return; }
    signal.addEventListener?.('abort', onAbort, { once: true });
    waiting.then(() => {
      if (settled) return;
      settled = true;
      signal.removeEventListener?.('abort', onAbort);
      resolve();
    }, (error) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener?.('abort', onAbort);
      reject(error);
    });
  });
}

function throwIfAborted(signal) {
  if (signal === null || !signal.aborted) return;
  throw new CollectorError(
    CollectorErrorCode.ABORTED,
    'rate limiter wait aborted',
    { retryable: false }
  );
}

function assertNonNegative(name, value) {
  if (!Number.isFinite(value) || value < 0) {
    throw new CollectorConfigError(
      `${name} must be a non-negative number, received ${value}`
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

function assertPositiveInteger(name, value) {
  if (!Number.isInteger(value) || value < 1) {
    throw new CollectorConfigError(
      `${name} must be a positive integer, received ${value}`
    );
  }
}

/**
 * 取 URL 的 origin。与熔断器同一口径：解析不了就用原串，
 * 粒度粗一点可以接受，完全失效不行。
 *
 * @param {string} url
 * @returns {string}
 */
function originOf(url) {
  try {
    return new URL(`${url}`).origin;
  } catch {
    return `${url}`;
  }
}
