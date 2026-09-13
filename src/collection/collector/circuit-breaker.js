import { CollectorConfigError, CollectorError, CollectorErrorCode } from './errors.js';

/** 代理侧故障码。恒定不计入目标健康度。 */
const PROXY_ERROR_CODES = new Set([
  CollectorErrorCode.PROXY_CONNECT_FAILED,
  CollectorErrorCode.PROXY_AUTH_FAILED,
  CollectorErrorCode.PROXY_EXHAUSTED,
]);

/**
 * 本地侧错误码。恒定不计入目标健康度。
 *
 * 限流队列满是我们自己的背压：目标可能完全健康，只是本地排队到上限。
 * 计进去会让一次队列溢出把 origin 熔断掉——自伤，而且掩盖真实原因。
 */
const LOCAL_ERROR_CODES = new Set([
  CollectorErrorCode.RATE_LIMITED,
]);

/**
 * 按 origin 的熔断器。
 *
 * 重试解决的是**偶发**失败；熔断解决的是**持续**失败。目标站点挂了之后继续重试
 * 只会让情况更糟：把自己的配额烧光，也给对方施压。
 *
 * ## 三个状态
 *
 * ```
 *              连续失败达阈值
 *   closed ─────────────────────→ open
 *     ↑                            │ 冷却期满
 *     │ 探测成功                     ↓
 *     └──────────── half-open ←──────┘
 *                     │ 探测失败
 *                     └──────────→ open（冷却期重新计时）
 * ```
 *
 * `half-open` 只放**一个**请求过去当探针。放多个的话，目标还没恢复时会一次性
 * 收到一批失败，等于没熔断。
 *
 * ## 按 origin 而不是全局
 *
 * 一个域名挂掉不该阻断其他域名。采集任务经常同时打多个 origin（主站 + CDN +
 * 验证码服务），全局熔断会让一个次要服务拖垮整轮采集。
 *
 * ## 哪些失败计入
 *
 * **只计目标侧的失败**：超时、连接错误、5xx。**不计**：
 *
 * - **策略违规**（origin 不在 allowlist、scheme 不允许）——那是调用方配置错了，
 *   不是对方挂了。计进去会让一次配置失误把 origin 熔断掉，掩盖真正的错误。
 * - **4xx**（除 429）——那是请求本身的问题，重试和熔断都帮不上。
 * - **abort**——调用方主动取消。
 *
 * 这条区分很重要：熔断器的输入必须是「对方的健康度」，混进自己的错误就失去意义。
 */

/** 熔断器状态。 */
export const CircuitState = Object.freeze({
  CLOSED: 'closed',
  OPEN: 'open',
  HALF_OPEN: 'half-open',
});

/** 默认计入熔断的 HTTP 状态。429 计入是因为它表示对方在限流。 */
const DEFAULT_TRIP_STATUS = Object.freeze([429, 500, 502, 503, 504, 507, 508]);

/** 默认计入熔断的错误码。 */
const DEFAULT_TRIP_ERRORS = Object.freeze([
  CollectorErrorCode.REQUEST_TIMEOUT,
  CollectorErrorCode.REQUEST_FAILED,
]);

export class CircuitBreaker {
  #failureThreshold;
  #cooldownMs;
  #halfOpenSuccesses;
  #tripStatus;
  #tripErrors;
  #now;
  /** origin -> { state, failures, successes, openedAt, probeInFlight } */
  #circuits = new Map();

  /**
   * @param {object} [config]
   * @param {number} [config.failureThreshold=5] 连续失败多少次后打开
   * @param {number} [config.cooldownMs=30000] 打开后多久转 half-open
   * @param {number} [config.halfOpenSuccesses=1] half-open 需要几次成功才关闭
   * @param {number[]} [config.tripStatus] 计入熔断的状态码
   * @param {string[]} [config.tripErrors] 计入熔断的错误码
   * @param {() => number} [config.now] 注入时钟便于测试
   */
  constructor(config = {}) {
    const {
      failureThreshold = 5,
      cooldownMs = 30_000,
      halfOpenSuccesses = 1,
      tripStatus = DEFAULT_TRIP_STATUS,
      cooldown,
      now = Date.now,
    } = config;

    if (cooldown !== undefined) {
      throw new CollectorConfigError(
        "circuit breaker option is 'cooldownMs', not 'cooldown'"
      );
    }
    if (!Number.isInteger(failureThreshold) || failureThreshold < 1) {
      throw new CollectorConfigError(
        `failureThreshold must be a positive integer, received ${failureThreshold}`
      );
    }
    if (!Number.isFinite(cooldownMs) || cooldownMs < 0) {
      throw new CollectorConfigError(
        `cooldownMs must be a non-negative number, received ${cooldownMs}`
      );
    }
    if (!Number.isInteger(halfOpenSuccesses) || halfOpenSuccesses < 1) {
      throw new CollectorConfigError(
        `halfOpenSuccesses must be a positive integer, received ${halfOpenSuccesses}`
      );
    }

    this.#failureThreshold = failureThreshold;
    this.#cooldownMs = cooldownMs;
    this.#halfOpenSuccesses = halfOpenSuccesses;
    this.#tripStatus = new Set(tripStatus);
    this.#tripErrors = new Set(config.tripErrors ?? DEFAULT_TRIP_ERRORS);
    this.#now = now;
  }

  /**
   * 取（或建）一个 origin 的电路记录。
   *
   * @param {string} origin
   * @returns {object}
   */
  #circuit(origin) {
    let circuit = this.#circuits.get(origin);
    if (circuit === undefined) {
      circuit = {
        state: CircuitState.CLOSED,
        failures: 0,
        successes: 0,
        openedAt: 0,
        probeInFlight: false,
      };
      this.#circuits.set(origin, circuit);
    }
    return circuit;
  }

  /**
   * 当前状态。会把冷却期已满的 `open` 顺带推进到 `half-open`。
   *
   * @param {string} url
   * @returns {string}
   */
  stateFor(url) {
    const circuit = this.#circuit(originOf(url));
    this.#advance(circuit);
    return circuit.state;
  }

  /** 冷却期满则转 half-open。读状态与放行都要先过这一步。 */
  #advance(circuit) {
    if (circuit.state !== CircuitState.OPEN) return;
    if (this.#now() - circuit.openedAt < this.#cooldownMs) return;
    circuit.state = CircuitState.HALF_OPEN;
    circuit.successes = 0;
    circuit.probeInFlight = false;
  }

  /**
   * 请求前检查。电路打开时抛 `CIRCUIT_OPEN`，**不产生任何 IO**。
   *
   * @param {string} url
   */
  assert(url) {
    const origin = originOf(url);
    const circuit = this.#circuit(origin);
    this.#advance(circuit);

    if (circuit.state === CircuitState.CLOSED) return;

    if (circuit.state === CircuitState.HALF_OPEN) {
      // half-open 只放一个探针过去
      if (circuit.probeInFlight) {
        throw this.#openError(origin, circuit, 'probe already in flight');
      }
      circuit.probeInFlight = true;
      return;
    }

    throw this.#openError(
      origin,
      circuit,
      `cooling down for ${Math.max(0, this.#cooldownMs - (this.#now() - circuit.openedAt))}ms`
    );
  }

  #openError(origin, circuit, detail) {
    return new CollectorError(
      CollectorErrorCode.CIRCUIT_OPEN,
      `circuit open for ${origin}: ${detail}`,
      // 熔断不可重试：重试的意义就是绕过它
      {
        retryable: false,
        context: { origin, state: circuit.state, failures: circuit.failures },
      }
    );
  }

  /**
   * 记录一次成功。
   *
   * @param {string} url
   */
  recordSuccess(url) {
    const circuit = this.#circuit(originOf(url));
    circuit.probeInFlight = false;

    if (circuit.state === CircuitState.HALF_OPEN) {
      circuit.successes += 1;
      if (circuit.successes >= this.#halfOpenSuccesses) {
        circuit.state = CircuitState.CLOSED;
        circuit.failures = 0;
        circuit.successes = 0;
      }
      return;
    }

    // closed 状态下成功清零连续失败计数——阈值算的是**连续**失败
    circuit.failures = 0;
  }

  /**
   * 记录一次结果，自行判断是否计入熔断。
   *
   * @param {string} url
   * @param {object} outcome
   * @param {object} [outcome.response]
   * @param {object} [outcome.error]
   */
  record(url, outcome = {}) {
    if (!this.countsAsFailure(outcome)) {
      // 不计入熔断的失败（策略违规、4xx、abort）也不该被当成成功——
      // 否则一次配置错误会把真实的连续失败计数清零。
      if (outcome.error === undefined || outcome.error === null) {
        this.recordSuccess(url);
      } else {
        this.#circuit(originOf(url)).probeInFlight = false;
      }
      return;
    }
    this.recordFailure(url);
  }

  /**
   * 这次结果是否算「对方不健康」。
   *
   * @param {object} outcome
   * @returns {boolean}
   */
  countsAsFailure(outcome = {}) {
    const { response = null, error = null } = outcome;

    if (error !== null) {
      // 策略违规是调用方的问题，abort 是调用方的决定——都不是对方挂了
      if (error.isPolicyViolation === true) return false;
      if (error.code === CollectorErrorCode.ABORTED) return false;
      if (error.code === CollectorErrorCode.CIRCUIT_OPEN) return false;
      // 代理故障是我们这一侧的出口坏了，不是对方挂了。算进去的话一个代理挂掉
      // 会跳闸所有 origin 并归咎于目标——运维看到"所有站点都挂了"，真实原因
      // 被完全掩盖。这里做硬排除，即使调用方把 PROXY_* 配进 tripErrors 也不生效。
      if (PROXY_ERROR_CODES.has(error.code)) return false;
      // 本地背压（限流队列满）同理：目标没挂，是我们自己该等。
      if (LOCAL_ERROR_CODES.has(error.code)) return false;
      return this.#tripErrors.has(error.code);
    }

    if (response !== null && typeof response.status === 'number') {
      return this.#tripStatus.has(response.status);
    }

    return false;
  }

  /**
   * 记录一次失败，必要时打开电路。
   *
   * @param {string} url
   */
  recordFailure(url) {
    const circuit = this.#circuit(originOf(url));
    circuit.probeInFlight = false;

    if (circuit.state === CircuitState.HALF_OPEN) {
      // 探测失败：直接回到 open，冷却期重新计时
      circuit.state = CircuitState.OPEN;
      circuit.openedAt = this.#now();
      circuit.successes = 0;
      return;
    }

    circuit.failures += 1;
    if (circuit.failures >= this.#failureThreshold) {
      circuit.state = CircuitState.OPEN;
      circuit.openedAt = this.#now();
      circuit.successes = 0;
    }
  }

  /**
   * 手动闭合一个 origin（或全部）。用于运维介入与测试。
   *
   * @param {string} [url] 省略则重置全部
   */
  reset(url) {
    if (url === undefined) {
      this.#circuits.clear();
      return;
    }
    this.#circuits.delete(originOf(url));
  }

  /**
   * 当前所有电路的快照，用于诊断。
   *
   * @returns {object[]}
   */
  snapshot() {
    return [...this.#circuits.entries()].map(([origin, circuit]) => {
      this.#advance(circuit);
      return Object.freeze({
        origin,
        state: circuit.state,
        failures: circuit.failures,
        successes: circuit.successes,
        openedAt: circuit.openedAt,
      });
    });
  }
}

/**
 * 取 URL 的 origin。解析不了就用原串——熔断的粒度宁可粗一点，
 * 也不要因为解析失败而完全失效。
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

/**
 * 创建一个永不熔断的熔断器。
 *
 * 用于「明确不要熔断」的场景，比显式传一大堆阈值清楚。
 *
 * @returns {CircuitBreaker}
 */
export function createDisabledCircuitBreaker() {
  return new CircuitBreaker({ failureThreshold: Number.MAX_SAFE_INTEGER });
}
