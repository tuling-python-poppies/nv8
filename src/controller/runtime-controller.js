import { Opcode } from "../protocol/constants.js";
import {
  ChildProcessConnection,
  MINIMUM_REALM_BOOTSTRAP_TIMEOUT_MS,
} from "./child-process.js";
import { PooledWorkerThreadConnection } from "./worker-thread-pool.js";

export class RuntimeController {
  constructor(options) {
    this.options = options;
    this.connection = this.createConnection();
    this.closed = false;
    this.starting = null;
    this.persistence = null;
    this.traceEnabled = options.proxyTrace.enabled;
  }

  async start() {
    this.assertOpen();
    if (this.starting === null) {
      this.starting = this.connection.start(this.initPayload())
        .finally(() => {
          this.starting = null;
        });
    }
    await this.starting;
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
    await this.start();
    return this.connection.request(opcode, payload, timeoutMs);
  }

  evaluate(source) {
    return this.send(Opcode.EVALUATE, { source });
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
    } catch {
      // Fallback: old-style kill-and-restart for children that don't
      // support the RESET_REALM opcode.
    }
    // Slow path: export persistence, kill child, and cold-start a new one.
    this.persistence = await this.send(
      Opcode.SET_PAGE,
      { page },
      resetTimeout,
    );
    this.connection.terminate();
    this.options = updatedOptions;
    this.connection = this.createConnection();
    await this.start();
  }

  createConnection() {
    if (this.options.execution.backend === "worker-thread") {
      return new PooledWorkerThreadConnection(this.options.limits);
    }
    return new ChildProcessConnection(this.options.limits);
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
