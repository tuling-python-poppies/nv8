/**
 * 熔断器
 *
 * 重试解决**偶发**失败；熔断解决**持续**失败。目标站点挂了之后继续重试只会把
 * 自己的配额烧光，也给对方施压。
 *
 * 三个设计要点，每条都对应一种会让熔断器失效的做法：
 *
 * 1. **按 origin 而不是全局** —— 采集任务常同时打多个 origin（主站 + CDN +
 *    验证码服务），全局熔断会让一个次要服务拖垮整轮采集。
 * 2. **half-open 只放一个探针** —— 放多个的话目标还没恢复时会一次性收到一批
 *    失败，等于没熔断。
 * 3. **只计目标侧的失败** —— 策略违规、4xx、abort 都不算「对方不健康」。
 *    混进自己的错误，熔断器的输入就不再是健康度信号。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CircuitBreaker,
  CircuitState,
} from '../src/collection/collector/circuit-breaker.js';
import {
  CollectorError,
  CollectorErrorCode,
  CollectorPolicyError,
} from '../src/collection/collector/errors.js';

const URL_A = 'https://a.test/path';
const URL_B = 'https://b.test/path';

/** 可控时钟。熔断器的行为完全由时间驱动，用真实时钟就只能靠 sleep 赌。 */
function withClock(start = 1_000) {
  let now = start;
  return {
    now: () => now,
    advance(ms) { now += ms; },
  };
}

function timeoutError() {
  return new CollectorError(CollectorErrorCode.REQUEST_TIMEOUT, 'timed out', {
    retryable: true,
  });
}

function transportError() {
  return new CollectorError(CollectorErrorCode.REQUEST_FAILED, 'socket hang up', {
    retryable: true,
  });
}

// ------------------------------------------------------ 配置校验

test('rejects a misspelled cooldown option instead of ignoring it', () => {
  // 静默忽略拼错的选项 = 用户以为设了冷却期、实际用默认值
  assert.throws(
    () => new CircuitBreaker({ cooldown: 1_000 }),
    (error) => {
      assert.equal(error.code, CollectorErrorCode.INVALID_CONFIG);
      assert.match(error.message, /cooldownMs/);
      return true;
    }
  );
});

test('rejects non-positive thresholds', () => {
  for (const failureThreshold of [0, -1, 1.5]) {
    assert.throws(
      () => new CircuitBreaker({ failureThreshold }),
      (error) => error.code === CollectorErrorCode.INVALID_CONFIG,
      `failureThreshold ${failureThreshold} must be rejected`
    );
  }
  assert.throws(
    () => new CircuitBreaker({ cooldownMs: -1 }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG
  );
  assert.throws(
    () => new CircuitBreaker({ halfOpenSuccesses: 0 }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG
  );
});

// ------------------------------------------------------ 基本状态机

test('opens after the configured number of consecutive failures', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({ failureThreshold: 3, now: clock.now });

  assert.equal(breaker.stateFor(URL_A), CircuitState.CLOSED);
  breaker.record(URL_A, { error: timeoutError() });
  breaker.record(URL_A, { error: timeoutError() });
  assert.equal(breaker.stateFor(URL_A), CircuitState.CLOSED, 'not yet at threshold');

  breaker.record(URL_A, { error: timeoutError() });
  assert.equal(breaker.stateFor(URL_A), CircuitState.OPEN);
});

test('a success resets the consecutive failure count', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({ failureThreshold: 3, now: clock.now });

  breaker.record(URL_A, { error: timeoutError() });
  breaker.record(URL_A, { error: timeoutError() });
  // 阈值算的是**连续**失败，成功必须清零
  breaker.record(URL_A, { response: { status: 200 } });
  breaker.record(URL_A, { error: timeoutError() });
  breaker.record(URL_A, { error: timeoutError() });

  assert.equal(breaker.stateFor(URL_A), CircuitState.CLOSED);
});

test('an open circuit rejects without any IO', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({ failureThreshold: 1, now: clock.now });
  breaker.record(URL_A, { error: timeoutError() });

  assert.throws(
    () => breaker.assert(URL_A),
    (error) => {
      assert.equal(error.code, CollectorErrorCode.CIRCUIT_OPEN);
      // 熔断不可重试——重试的意义就是绕过它
      assert.equal(error.retryable, false);
      // 结构化上下文走 DiagnosticError 的 context 字段
      assert.equal(error.context.origin, 'https://a.test');
      return true;
    }
  );
});

// ------------------------------------------------------ 隔离性

test('one failing origin does not trip another', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({ failureThreshold: 2, now: clock.now });

  breaker.record(URL_A, { error: timeoutError() });
  breaker.record(URL_A, { error: timeoutError() });

  assert.equal(breaker.stateFor(URL_A), CircuitState.OPEN);
  // 一个域名挂掉不该阻断其他域名
  assert.equal(breaker.stateFor(URL_B), CircuitState.CLOSED);
  breaker.assert(URL_B);
});

test('the same origin on a different path shares one circuit', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({ failureThreshold: 2, now: clock.now });

  breaker.record('https://a.test/one', { error: timeoutError() });
  breaker.record('https://a.test/two', { error: timeoutError() });

  // 熔断粒度是 origin，不是 URL——同一个域名的不同路径共享健康度
  assert.equal(breaker.stateFor('https://a.test/three'), CircuitState.OPEN);
});

// ------------------------------------------------------ 冷却与探测

test('the circuit becomes half-open after the cooldown', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({
    failureThreshold: 1, cooldownMs: 500, now: clock.now,
  });
  breaker.record(URL_A, { error: timeoutError() });

  clock.advance(499);
  assert.equal(breaker.stateFor(URL_A), CircuitState.OPEN, 'still cooling down');

  clock.advance(1);
  assert.equal(breaker.stateFor(URL_A), CircuitState.HALF_OPEN);
});

test('half-open admits exactly one probe', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({
    failureThreshold: 1, cooldownMs: 100, now: clock.now,
  });
  breaker.record(URL_A, { error: timeoutError() });
  clock.advance(100);

  breaker.assert(URL_A);
  // 放多个探针的话，目标还没恢复时会一次性收到一批失败，等于没熔断
  assert.throws(
    () => breaker.assert(URL_A),
    (error) => error.code === CollectorErrorCode.CIRCUIT_OPEN
  );
});

test('a successful probe closes the circuit', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({
    failureThreshold: 1, cooldownMs: 100, now: clock.now,
  });
  breaker.record(URL_A, { error: timeoutError() });
  clock.advance(100);

  breaker.assert(URL_A);
  breaker.record(URL_A, { response: { status: 200 } });

  assert.equal(breaker.stateFor(URL_A), CircuitState.CLOSED);
  breaker.assert(URL_A);
});

test('a failed probe reopens the circuit and restarts the cooldown', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({
    failureThreshold: 1, cooldownMs: 100, now: clock.now,
  });
  breaker.record(URL_A, { error: timeoutError() });
  clock.advance(100);
  breaker.assert(URL_A);
  breaker.record(URL_A, { error: timeoutError() });

  assert.equal(breaker.stateFor(URL_A), CircuitState.OPEN);
  // 冷却期必须重新计时，否则失败的探测等于白探
  clock.advance(99);
  assert.equal(breaker.stateFor(URL_A), CircuitState.OPEN);
  clock.advance(1);
  assert.equal(breaker.stateFor(URL_A), CircuitState.HALF_OPEN);
});

test('halfOpenSuccesses requires that many probes before closing', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({
    failureThreshold: 1, cooldownMs: 100, halfOpenSuccesses: 2, now: clock.now,
  });
  breaker.record(URL_A, { error: timeoutError() });
  clock.advance(100);

  breaker.assert(URL_A);
  breaker.record(URL_A, { response: { status: 200 } });
  assert.equal(breaker.stateFor(URL_A), CircuitState.HALF_OPEN, 'one success is not enough');

  breaker.assert(URL_A);
  breaker.record(URL_A, { response: { status: 200 } });
  assert.equal(breaker.stateFor(URL_A), CircuitState.CLOSED);
});

// ------------------------------------------------------ 哪些失败计入

test('policy violations do not count as target failures', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({ failureThreshold: 2, now: clock.now });
  const violation = new CollectorPolicyError(
    CollectorErrorCode.ORIGIN_NOT_ALLOWED, 'not allowed'
  );

  for (let index = 0; index < 5; index += 1) {
    breaker.record(URL_A, { error: violation });
  }

  // allowlist 配错是调用方的问题。计进去会让一次配置失误把 origin 熔断掉，
  // 反过来掩盖真正的错误。
  assert.equal(breaker.stateFor(URL_A), CircuitState.CLOSED);
});

test('aborts do not count as target failures', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({ failureThreshold: 2, now: clock.now });
  const aborted = new CollectorError(CollectorErrorCode.ABORTED, 'cancelled', {
    retryable: false,
  });

  breaker.record(URL_A, { error: aborted });
  breaker.record(URL_A, { error: aborted });
  breaker.record(URL_A, { error: aborted });

  // abort 是调用方主动取消，不是对方挂了
  assert.equal(breaker.stateFor(URL_A), CircuitState.CLOSED);
});

test('4xx does not count but 429 does', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({ failureThreshold: 2, now: clock.now });

  breaker.record(URL_A, { response: { status: 404 } });
  breaker.record(URL_A, { response: { status: 403 } });
  breaker.record(URL_A, { response: { status: 400 } });
  // 4xx 是请求本身的问题，重试和熔断都帮不上
  assert.equal(breaker.stateFor(URL_A), CircuitState.CLOSED);

  breaker.record(URL_B, { response: { status: 429 } });
  breaker.record(URL_B, { response: { status: 429 } });
  // 429 表示对方在限流——正是该退避的信号
  assert.equal(breaker.stateFor(URL_B), CircuitState.OPEN);
});

test('5xx counts as a target failure', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({ failureThreshold: 2, now: clock.now });

  breaker.record(URL_A, { response: { status: 503 } });
  breaker.record(URL_A, { response: { status: 502 } });

  assert.equal(breaker.stateFor(URL_A), CircuitState.OPEN);
});

test('a non-counting failure does not reset the failure count either', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({ failureThreshold: 3, now: clock.now });
  const violation = new CollectorPolicyError(
    CollectorErrorCode.ORIGIN_NOT_ALLOWED, 'not allowed'
  );

  breaker.record(URL_A, { error: timeoutError() });
  breaker.record(URL_A, { error: timeoutError() });
  // 策略违规既不计入失败，也不该当成成功——否则配置错误会清零真实的连续失败
  breaker.record(URL_A, { error: violation });
  breaker.record(URL_A, { error: transportError() });

  assert.equal(breaker.stateFor(URL_A), CircuitState.OPEN);
});

test('countsAsFailure can be queried directly', () => {
  const breaker = new CircuitBreaker();

  assert.equal(breaker.countsAsFailure({ response: { status: 500 } }), true);
  assert.equal(breaker.countsAsFailure({ response: { status: 200 } }), false);
  assert.equal(breaker.countsAsFailure({ error: timeoutError() }), true);
  assert.equal(breaker.countsAsFailure({}), false);
  assert.equal(
    breaker.countsAsFailure({
      error: new CollectorError(CollectorErrorCode.CIRCUIT_OPEN, 'open', { retryable: false }),
    }),
    false,
    'the breaker must not feed on its own rejections'
  );
});

// ------------------------------------------------------ 运维接口

test('reset closes a single origin without touching others', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({ failureThreshold: 1, now: clock.now });
  breaker.record(URL_A, { error: timeoutError() });
  breaker.record(URL_B, { error: timeoutError() });

  breaker.reset(URL_A);
  assert.equal(breaker.stateFor(URL_A), CircuitState.CLOSED);
  assert.equal(breaker.stateFor(URL_B), CircuitState.OPEN);

  breaker.reset();
  assert.equal(breaker.stateFor(URL_B), CircuitState.CLOSED);
});

test('snapshot reports every known circuit', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({
    failureThreshold: 1, cooldownMs: 50, now: clock.now,
  });
  breaker.record(URL_A, { error: timeoutError() });
  breaker.record(URL_B, { response: { status: 200 } });

  const snapshot = breaker.snapshot();
  const byOrigin = new Map(snapshot.map((entry) => [entry.origin, entry]));

  assert.equal(byOrigin.get('https://a.test').state, CircuitState.OPEN);
  assert.equal(byOrigin.get('https://b.test').state, CircuitState.CLOSED);

  // 快照顺带推进冷却期已满的电路，读到的状态才是当下真实状态
  clock.advance(50);
  const later = new Map(breaker.snapshot().map((entry) => [entry.origin, entry]));
  assert.equal(later.get('https://a.test').state, CircuitState.HALF_OPEN);
});

test('an unparseable url still gets its own circuit', () => {
  const clock = withClock();
  const breaker = new CircuitBreaker({ failureThreshold: 1, now: clock.now });

  // 解析失败时退化成按原串分组：粒度粗一点可以接受，完全失效不行
  breaker.record('not a url', { error: timeoutError() });
  assert.equal(breaker.stateFor('not a url'), CircuitState.OPEN);
  assert.equal(breaker.stateFor(URL_A), CircuitState.CLOSED);
});

test('the disabled breaker never opens', () => {
  const breaker = new CircuitBreaker({ failureThreshold: Number.MAX_SAFE_INTEGER });
  for (let index = 0; index < 1_000; index += 1) {
    breaker.record(URL_A, { error: timeoutError() });
  }
  assert.equal(breaker.stateFor(URL_A), CircuitState.CLOSED);
  breaker.assert(URL_A);
});
