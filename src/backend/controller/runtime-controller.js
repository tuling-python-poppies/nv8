import { Opcode } from "../protocol/constants.js";
import {
  ChildProcessConnection,
  MINIMUM_REALM_BOOTSTRAP_TIMEOUT_MS,
} from "./child-process.js";
import { PooledWorkerThreadConnection } from "./worker-thread-pool.js";

const RESTART_POLICY_FAIL_FAST = "fail-fast";
const RESTART_POLICY_RESTART = "restart";

export class RuntimeController {
  constructor(options) {
    this.options = options;
    this.closed = false;
    this.starting = null;
    this.persistence = null;
    this.traceEnabled = options.proxyTrace.enabled;
    this.restartPolicy = options.execution?.restart === RESTART_POLICY_RESTART
      ? RESTART_POLICY_RESTART
      : RESTART_POLICY_FAIL_FAST;
    this.onCrash = typeof options.onCrash === "function" ? options.onCrash : null;
    this.lastCrash = null;
    this.crashCause = null;
    this.lastRestart = null;
    this.connection = this.createConnection();
  }

  async start() {
    this.assertOpen();
    if (this.lastCrash !== null) {
      if (this.restartPolicy !== RESTART_POLICY_RESTART) {
        throw this.crashError();
      }
      await this.restartFromCrash();
    }
    if (this.starting === null) {
      this.starting = this.connection.start(this.initPayload())
        .finally(() => {
          this.starting = null;
        });
    }
    await this.starting;
    // close() 可能在 start 进行中发生；启动完成后再确认一次生命周期，
    // 避免调用方拿到一个已终止连接的句柄（F-E2）。
    this.assertOpen();
  }

  initPayload() {
    return {
      page: this.options.page,
      fingerprint: this.options.fingerprint,
      proxyTrace: {
        ...this.options.proxyTrace,
        enabled: this.traceEnabled,
      },
      networkCapture: this.options.networkCapture,
      replay: this.options.replay,
      evidence: this.options.evidence,
      limits: this.options.limits,
      persistence: this.persistence,
    };
  }

  async send(opcode, payload, timeoutMs = this.options.limits.timeoutMs) {
    this.assertOpen();
    try {
      await this.start();
    } catch (error) {
      // 关闭与启动竞争时，优先报告「已关闭」，而不是底层 terminate 的
      // 传输错误——调用方需要能区分生命周期状态与真实传输故障。
      this.assertOpen();
      throw error;
    }
    this.assertOpen();
    return this.connection.request(opcode, payload, timeoutMs);
  }

  evaluate(source) {
    return this.send(Opcode.EVALUATE, { source });
  }

  evaluateWithPayload(source, payload) {
    return this.send(Opcode.EVALUATE, { source, payload });
  }

  batchEvaluate(sources) {
    return this.send(Opcode.BATCH_EVALUATE, { sources });
  }

  evaluateModule(source, url) {
    return this.send(Opcode.EVALUATE_MODULE, { source, url });
  }

  async setPage(page) {
    const resetTimeout = Math.max(
      this.options.limits.timeoutMs,
      MINIMUM_REALM_BOOTSTRAP_TIMEOUT_MS,
    );
    const updatedOptions = Object.freeze({ ...this.options, page });
    // Fast path: reset the realm in-process, preserving the module cache.
    let resetError = null;
    try {
      const persistence = await this.send(
        Opcode.RESET_REALM,
        {
          page: updatedOptions.page,
          fingerprint: updatedOptions.fingerprint,
          proxyTrace: {
            ...updatedOptions.proxyTrace,
            enabled: this.traceEnabled,
          },
          networkCapture: updatedOptions.networkCapture,
          replay: updatedOptions.replay,
          evidence: updatedOptions.evidence,
          limits: updatedOptions.limits,
          persistence: this.persistence,
        },
        resetTimeout,
      );
      this.persistence = persistence;
      this.options = updatedOptions;
      return;
    } catch (error) {
      resetError = error;
    }
    if (!isUnsupportedResetRealm(resetError)) {
      // 真实失败不降级 kill/restart：那会把 Realm 生命周期错误吞成一次
      // 静默冷启，调用方只看到一个无关的错误（IKF39Z-7）。
      throw resetError;
    }
    // Slow path: old-style kill-and-restart for children that don't
    // support the RESET_REALM opcode.
    try {
      this.persistence = await this.send(
        Opcode.SET_PAGE,
        { page },
        resetTimeout,
      );
    } catch (error) {
      if (error !== null && error !== undefined && error.cause === undefined) {
        error.cause = resetError;
      }
      throw error;
    }
    this.connection.terminate();
    this.options = updatedOptions;
    this.connection = this.createConnection();
    await this.start();
  }

  createConnection() {
    const connection = this.options.execution.backend === "worker-thread"
      ? new PooledWorkerThreadConnection(this.options.limits)
      : new ChildProcessConnection(this.options.limits);
    connection.onExit = error => this.handleConnectionExit(error);
    return connection;
  }

  handleConnectionExit(cause) {
    if (this.closed) return;
    const crash = Object.freeze({
      code: cause?.code ?? "ERR_EDGE_RUNTIME_CRASHED",
      message: `${cause?.message ?? cause}`,
      signal: cause?.signal ?? null,
      exitCode: cause?.exitCode ?? null,
      stderrTail: cause?.stderrTail ?? "",
    });
    this.lastCrash = crash;
    this.crashCause = cause;
    if (this.onCrash !== null) {
      try {
        this.onCrash(crash);
      } catch {
        // 崩溃观察者自身的异常不能掩盖崩溃本身。
      }
    }
  }

  async restartFromCrash() {
    const crash = this.lastCrash;
    this.lastCrash = null;
    this.crashCause = null;
    // Realm 状态随进程丢失；持久化只能在重启后重新导出，不能假装还在。
    this.persistence = null;
    this.connection = this.createConnection();
    this.starting = this.connection.start(this.initPayload())
      .finally(() => {
        this.starting = null;
      });
    await this.starting;
    this.lastRestart = crash;
  }

  crashError() {
    const crash = this.lastCrash;
    const detail = crash === null
      ? ""
      : ` (${crash.code}${crash.signal === null ? "" : ` signal=${crash.signal}`})`;
    const error = new Error(`Sandbox runtime crashed${detail}`);
    error.name = "SandboxRuntimeCrashError";
    error.code = "ERR_EDGE_RUNTIME_CRASHED";
    error.crash = crash;
    error.signal = crash?.signal ?? null;
    error.exitCode = crash?.exitCode ?? null;
    error.stderrTail = crash?.stderrTail ?? "";
    if (this.crashCause !== null) error.cause = this.crashCause;
    return error;
  }

  async enableTrace() {
    await this.send(Opcode.ENABLE_TRACE, Object.create(null));
    this.traceEnabled = true;
  }

  async disableTrace() {
    await this.send(Opcode.DISABLE_TRACE, Object.create(null));
    this.traceEnabled = false;
  }

  clearTrace() {
    return this.send(Opcode.CLEAR_TRACE, Object.create(null));
  }

  readTrace() {
    return this.send(Opcode.READ_TRACE, Object.create(null));
  }

  readNetworkRequests() {
    return this.send(Opcode.READ_NETWORK_REQUESTS, Object.create(null));
  }

  clearNetworkRequests() {
    return this.send(Opcode.CLEAR_NETWORK_REQUESTS, Object.create(null));
  }

  readResources() {
    return this.send(Opcode.READ_RESOURCES, Object.create(null));
  }

  async close() {
    if (this.closed) {
      return;
    }
    this.closed = true;
    if (this.connection instanceof PooledWorkerThreadConnection) {
      // Recycle: sends CLOSE internally, then returns worker to pool.
      await this.connection.closeAndRecycle();
    } else {
      try {
        if (this.connection.ready) {
          await this.connection.request(
            Opcode.CLOSE,
            Object.create(null),
            this.options.limits.timeoutMs,
          );
        }
      } finally {
        this.connection.terminate();
      }
    }
  }

  assertOpen() {
    if (this.closed) {
      throw new Error("EdgeSandbox is closed");
    }
  }
}

function isUnsupportedResetRealm(error) {
  return error?.code === "ERR_EDGE_PROTOCOL_REQUEST"
    && /unknown request opcode/i.test(`${error.message ?? ""}`);
}
