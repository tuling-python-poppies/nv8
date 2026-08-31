/**
 * 限流与并发控制
 *
 * 熔断是「对方挂了就停」，限流是「对方没挂也别打太快」。两者缺任何一个都会出事：
 * 只有熔断，稳定但脆弱的目标会被打到熔断为止；只有限流，目标彻底挂掉之后还在
 * 按节奏敲门。
 *
 * ## 测试用虚拟时钟 + 虚拟等待
 *
 * 限流的行为完全由时间驱动。用真实 `setTimeout` 只能靠 sleep 赌（项目已禁止），
 * 而且慢。这里把 `now` 与 `sleep` 都注入：`sleep` 只登记唤醒时刻，`tick()`
 * 把时钟推进到最近的唤醒点。整个套件零真实延时，且能精确断言"在第 500ms 放行"。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { RateLimiter, createUnlimitedRateLimiter } from '../src/collector/rate-limiter.js';
import { CollectorErrorCode } from '../src/collector/errors.js';

const URL_A = 'https://a.test/path';
const URL_B = 'https://b.test/path';

/**
 * 虚拟调度器。
 *
 * `sleep` 不真的等，只把 resolve 挂在一个时刻上；`drain()` 反复把时钟推进到
 * 最近的唤醒点，直到没有待唤醒项。
 */
function harness(config = {}) {
  let now = 0;
  let pending = [];

  const limiter = new RateLimiter({
    ...config,
    now: () => now,
    sleep: (ms) => new Promise((resolve) => {
      pending.push({ at: now + ms, resolve });
    }),
  });

  /**
   * 推进虚拟时钟直到没有待唤醒项。
   *
   * `idleRounds` 是关键：不能一看到 `pending` 空了就退出。acquire 在两次
   * `sleep` 之间会有一段只跑微任务的窗口，那一瞬 `pending` 是空的——早退会
   * 让它的下一次 sleep 永远等不到时钟推进，整个测试文件挂住。
   *
   * 所以必须连续若干轮都没有待唤醒项才认定真的结束。
   */
  async function drain(maxRounds = 400) {
    let idleRounds = 0;
    for (let round = 0; round < maxRounds; round += 1) {
      // 让已就绪的 promise 链先跑完，再决定推进到哪一刻
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      if (pending.length === 0) {
        idleRounds += 1;
        if (idleRounds >= 4) return;
        continue;
      }

      idleRounds = 0;
      const next = Math.min(...pending.map((entry) => entry.at));
      now = Math.max(now, next);
      const due = pending.filter((entry) => entry.at <= now);
      pending = pending.filter((entry) => entry.at > now);
      for (const entry of due) entry.resolve();
    }
  }

  return { limiter, drain, at: () => now, advance(ms) { now += ms; } };
}

// ------------------------------------------------------ 配置校验

test('rejects requestsPerMinute with a hint instead of ignoring it', () => {
  // 静默忽略会让用户以为限了每分钟，实际完全不限速
  assert.throws(
    () => new RateLimiter({ requestsPerMinute: 60 }),
    (error) => {
      assert.equal(error.code, CollectorErrorCode.INVALID_CONFIG);
      assert.match(error.message, /requestsPerSecond/);
      return true;
    }
  );
});

test('rejects invalid numeric configuration', () => {
  assert.throws(() => new RateLimiter({ requestsPerSecond: -1 }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG);
  assert.throws(() => new RateLimiter({ maxConcurrent: 1.5 }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG);
  assert.throws(() => new RateLimiter({ maxQueued: 0 }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG);
  assert.throws(() => new RateLimiter({ burst: 0 }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG);
});

test('an unlimited limiter admits everything immediately', async () => {
  const limiter = createUnlimitedRateLimiter();
  const releases = [];
  for (let index = 0; index < 50; index += 1) {
    releases.push(await limiter.acquire(URL_A));
  }
  for (const release of releases) release();

  assert.equal(limiter.requestsPerSecond, 0);
  assert.equal(limiter.maxConcurrent, 0);
});

// ------------------------------------------------------ 速率

test('burst is admitted at once, then the rate applies', async () => {
  const h = harness({ requestsPerSecond: 2, burst: 2 });
  const stamps = [];

  const all = Promise.all([1, 2, 3, 4].map(async () => {
    const release = await h.limiter.acquire(URL_A);
    stamps.push(h.at());
    release();
  }));
  await h.drain();
  await all;

  // 2 个令牌立刻用掉，之后 2/秒 → 每 500ms 一个
  assert.deepEqual(stamps, [0, 0, 500, 1000]);
});

test('tokens refill over time and cap at burst', async () => {
  const h = harness({ requestsPerSecond: 4, burst: 2 });

  (await h.limiter.acquire(URL_A))();
  (await h.limiter.acquire(URL_A))();
  assert.equal(h.limiter.snapshot()[0].tokens, 0);

  // 攒 10 秒也只能攒到桶容量，不能无限攒额度
  h.advance(10_000);
  assert.equal(h.limiter.snapshot()[0].tokens, 2);
});

test('rate limits are per origin', async () => {
  const h = harness({ requestsPerSecond: 1, burst: 1 });

  (await h.limiter.acquire(URL_A))();
  // A 的令牌用完了，但 B 有自己的桶——一个域名限速不该拖累其他域名
  const release = await h.limiter.acquire(URL_B);
  release();

  assert.equal(h.at(), 0, 'B must not have waited');
});

// ------------------------------------------------------ 并发

test('maxConcurrent caps in-flight requests', async () => {
  const h = harness({ maxConcurrent: 2 });

  const first = await h.limiter.acquire(URL_A);
  const second = await h.limiter.acquire(URL_A);
  assert.equal(h.limiter.snapshot()[0].inFlight, 2);

  let thirdAdmitted = false;
  const third = h.limiter.acquire(URL_A).then((release) => {
    thirdAdmitted = true;
    return release;
  });

  await h.drain(5);
  assert.equal(thirdAdmitted, false, 'the third must wait for a slot');

  first();
  await h.drain();
  assert.equal(thirdAdmitted, true);
  (await third)();
  second();
});

test('release is idempotent', async () => {
  const h = harness({ maxConcurrent: 1 });
  const release = await h.limiter.acquire(URL_A);

  // 调用方常写在 finally 里，异常路径可能重复触发；
  // 重复归还会把 inFlight 减成负数，进而让并发上限失效
  release();
  release();
  release();

  assert.equal(h.limiter.snapshot()[0].inFlight, 0);
  const again = await h.limiter.acquire(URL_A);
  assert.equal(h.limiter.snapshot()[0].inFlight, 1);
  again();
});

test('rate and concurrency are enforced independently', async () => {
  // 只限速率的话，慢响应会堆积出无限并发；只限并发的话，快响应让速率无上限
  const h = harness({ requestsPerSecond: 100, burst: 100, maxConcurrent: 1 });

  const first = await h.limiter.acquire(URL_A);
  let secondAdmitted = false;
  const second = h.limiter.acquire(URL_A).then((release) => {
    secondAdmitted = true;
    return release;
  });

  await h.drain(5);
  // 令牌充足，但并发满了
  assert.equal(secondAdmitted, false);
  first();
  await h.drain();
  assert.equal(secondAdmitted, true);
  (await second)();
});

// ------------------------------------------------------ 公平性

test('waiters are admitted in arrival order', async () => {
  const h = harness({ requestsPerSecond: 1, burst: 1 });
  const order = [];

  const all = Promise.all(['first', 'second', 'third'].map(async (label) => {
    const release = await h.limiter.acquire(URL_A);
    order.push(label);
    release();
  }));
  await h.drain();
  await all;

  // 若按「谁先抢到令牌谁走」，高频调用方会持续插队，早到的可能永远等不到——
  // 分页采集里会表现为「第一页迟迟不返回」
  assert.deepEqual(order, ['first', 'second', 'third']);
});

// ------------------------------------------------------ 取消与背压

test('an aborted wait rejects and leaves no queue entry behind', async () => {
  const h = harness({ requestsPerSecond: 1, burst: 1 });
  (await h.limiter.acquire(URL_A))();

  const controller = new AbortController();
  const pending = h.limiter.acquire(URL_A, { signal: controller.signal });
  // **不推进时钟**：推进会让等待自然完成，就测不到取消了。
  // 让 acquire 先进入等待，再直接 abort。
  await Promise.resolve();
  await Promise.resolve();
  controller.abort();

  await assert.rejects(pending, (error) => {
    assert.equal(error.code, CollectorErrorCode.ABORTED);
    return true;
  });

  // 取消后队列必须清干净，否则后续请求会被幽灵队首永久阻塞
  assert.equal(h.limiter.snapshot()[0].queued, 0);
});

test('acquiring with an already-aborted signal fails fast', async () => {
  const h = harness();
  const controller = new AbortController();
  controller.abort();

  await assert.rejects(
    h.limiter.acquire(URL_A, { signal: controller.signal }),
    (error) => error.code === CollectorErrorCode.ABORTED
  );
});

test('a full queue is rejected as retryable backpressure', async () => {
  const h = harness({ requestsPerSecond: 1, burst: 1, maxQueued: 1 });
  (await h.limiter.acquire(URL_A))();

  // 占满队列的那一个用 signal 收尾，避免依赖虚拟时钟把它排空——
  // 这条测的是"队列满时如何拒绝"，不该顺带测排队放行。
  const controller = new AbortController();
  const queued = h.limiter.acquire(URL_A, { signal: controller.signal });
  await Promise.resolve();
  await Promise.resolve();

  await assert.rejects(h.limiter.acquire(URL_A), (error) => {
    // 队列满是背压信号，调用方可以退避重试，不是永久失败
    assert.equal(error.retryable, true);
    assert.match(error.message, /queue for https:\/\/a\.test is full/);
    return true;
  });

  controller.abort();
  await assert.rejects(queued, (error) => error.code === CollectorErrorCode.ABORTED);
  assert.equal(h.limiter.snapshot()[0].queued, 0);
});

// ------------------------------------------------------ run 包装

test('run releases the slot even when the body throws', async () => {
  const h = harness({ maxConcurrent: 1 });

  await assert.rejects(
    h.limiter.run(URL_A, () => Promise.reject(new Error('boom'))),
    /boom/
  );

  // 异常路径漏掉归还会把并发慢慢耗尽，表现为「跑一阵越来越慢直到卡死」
  assert.equal(h.limiter.snapshot()[0].inFlight, 0);
  (await h.limiter.acquire(URL_A))();
});

test('run returns the body result', async () => {
  const h = harness();
  assert.equal(await h.limiter.run(URL_A, () => Promise.resolve(42)), 42);
});

// ------------------------------------------------------ 诊断与重置

test('snapshot reports tokens, in-flight and queue depth', async () => {
  const h = harness({ requestsPerSecond: 2, burst: 2, maxConcurrent: 1 });
  const release = await h.limiter.acquire(URL_A);
  const queued = h.limiter.acquire(URL_A);
  await h.drain(3);

  const [entry] = h.limiter.snapshot();
  assert.equal(entry.origin, 'https://a.test');
  assert.equal(entry.inFlight, 1);
  assert.ok(entry.queued >= 1, 'the waiting acquire must be visible');
  release();
  await h.drain();
  (await queued)();
});

test('reset clears one origin or all of them', async () => {
  const h = harness({ requestsPerSecond: 1, burst: 1 });
  (await h.limiter.acquire(URL_A))();
  (await h.limiter.acquire(URL_B))();

  h.limiter.reset(URL_A);
  const origins = h.limiter.snapshot().map((entry) => entry.origin);
  assert.deepEqual(origins, ['https://b.test']);

  h.limiter.reset();
  assert.deepEqual(h.limiter.snapshot(), []);
});

test('an unparseable url gets its own bucket', async () => {
  const h = harness({ requestsPerSecond: 1, burst: 1 });
  (await h.limiter.acquire('not a url'))();
  // 与熔断器同一口径：解析失败退化成按原串分组
  assert.deepEqual(h.limiter.snapshot().map((entry) => entry.origin), ['not a url']);
});
