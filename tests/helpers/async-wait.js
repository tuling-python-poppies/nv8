/**
 * 测试用异步等待助手
 *
 * 为什么需要它：
 *
 * 测试里常见的 `await new Promise(r => setTimeout(r, 20))` 是在赌「20ms 内
 * 那件事一定发生」。在并行跑整套测试、或多 Node 版本连跑时，机器负载会让
 * 这个赌注失效，产生与被测实现完全无关的偶发失败。
 *
 * 正确做法是**等条件成立**而不是等一段时间：轮询到条件为真就立刻继续，
 * 超时才失败，且失败信息指向具体条件而不是一个神秘的数字。
 */

/** 默认超时。取值远大于正常耗时，只用于兜底而非计时。 */
const DEFAULT_TIMEOUT_MS = 5000;

/** 轮询间隔。足够小以免拖慢测试，足够大以免空转烧 CPU。 */
const POLL_INTERVAL_MS = 2;

/**
 * 轮询直到 `condition()` 返回真值。
 *
 * @param {() => unknown | Promise<unknown>} condition
 * @param {object} [options]
 * @param {number} [options.timeoutMs=5000]
 * @param {string} [options.label] 超时消息里显示的条件描述
 * @returns {Promise<void>}
 */
export async function waitUntil(condition, options = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, label = 'condition' } = options;
  const deadline = Date.now() + timeoutMs;

  for (;;) {
    if (await condition()) return;
    if (Date.now() >= deadline) {
      throw new Error(`waitUntil timed out after ${timeoutMs}ms waiting for: ${label}`);
    }
    await sleep(POLL_INTERVAL_MS);
  }
}

/**
 * 轮询直到 `read()` 的返回值等于 `expected`，超时则抛出带实际值的错误。
 *
 * 比 `waitUntil` 更适合断言场景：超时信息会带上最后读到的值，
 * 省去再加一条 assert 才知道实际是什么。
 *
 * @template T
 * @param {() => T | Promise<T>} read
 * @param {T} expected
 * @param {object} [options]
 * @param {number} [options.timeoutMs=5000]
 * @param {string} [options.label]
 * @returns {Promise<T>} 匹配上的值
 */
export async function waitForValue(read, expected, options = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, label = 'value' } = options;
  const deadline = Date.now() + timeoutMs;
  let actual;

  for (;;) {
    actual = await read();
    if (actual === expected) return actual;
    if (Date.now() >= deadline) {
      throw new Error(
        `waitForValue timed out after ${timeoutMs}ms waiting for ${label} `
        + `to become ${JSON.stringify(expected)}; last value was ${JSON.stringify(actual)}`
      );
    }
    await sleep(POLL_INTERVAL_MS);
  }
}

/**
 * 让已排入队列的异步回调有机会执行完。
 *
 * 用于那些没有可观察条件的场景（例如只想确认「不该发生的事没发生」）。
 * 与固定长等待的区别：它跑固定轮数的事件循环让位，而不是赌一个时长。
 *
 * @param {number} [rounds=8]
 * @returns {Promise<void>}
 */
export async function drainTasks(rounds = 8) {
  for (let index = 0; index < rounds; index += 1) {
    await sleep(0);
  }
}

/**
 * 单次让位。unref 定时器，避免拖住进程退出。
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    if (typeof timer.unref === 'function') timer.unref();
  });
}
