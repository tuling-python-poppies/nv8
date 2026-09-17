import { Buffer } from "node:buffer";
import { Worker } from "node:worker_threads";
import { Opcode } from "../protocol/constants.js";
import { ConnectionBase } from "./connection-base.js";
import { MINIMUM_REALM_BOOTSTRAP_TIMEOUT_MS } from "./child-process.js";
import { resolveRuntimeHeapMegabytes } from "./runtime-heap-floor.js";

const THREAD_ENTRY = new URL("../thread/entry.js", import.meta.url);
const MAX_IDLE_THREADS = 2;
const IDLE_THREAD_TTL_MS = 30_000;

function threadExitError(code) {
  const error = new Error(
    `Sandbox worker thread exited before responding (code=${code ?? "none"})`,
  );
  error.name = "SandboxThreadExitError";
  error.code = "ERR_EDGE_THREAD_EXIT";
  error.exitCode = code ?? null;
  return error;
}

// Module-level pool of idle worker threads with warm SOURCE_CACHE.
const idlePool = [];
let cleanupTimer = null;

function scheduleCleanup() {
  if (cleanupTimer !== null) return;
  cleanupTimer = setTimeout(() => {
    cleanupTimer = null;
    const now = Date.now();
    for (let i = idlePool.length - 1; i >= 0; i--) {
      if (now - idlePool[i].returnedAt > IDLE_THREAD_TTL_MS) {
        const entry = idlePool.splice(i, 1)[0];
        detachIdleListeners(entry);
        void entry.worker.terminate().catch(() => {});
      }
    }
    if (idlePool.length > 0) scheduleCleanup();
  }, IDLE_THREAD_TTL_MS);
  // 空闲线程的 TTL 回收不应维持进程存活：线程池是基础设施缓存，
  // 进程退出时随进程一起释放（测试可用 drainWorkerThreadPool 显式收口）。
  cleanupTimer.unref?.();
}

function removeIdleEntry(entry) {
  const index = idlePool.indexOf(entry);
  if (index === -1) return false;
  idlePool.splice(index, 1);
  return true;
}

function detachIdleListeners(entry) {
  entry.worker.removeListener?.("error", entry.onError);
  entry.worker.removeListener?.("exit", entry.onExit);
}

function acquireIdleWorker(heapMegabytes, timezone) {
  // 只有堆上限与指纹时区都一致的线程才能复用：Realm 内的 Intl/时区钩子
  // 由引擎按 INIT 指纹安装，池匹配是最外层的防线（IKFD9O）。
  for (let i = 0; i < idlePool.length; i++) {
    if (
      idlePool[i].heapMegabytes === heapMegabytes
      && idlePool[i].timezone === timezone
    ) {
      const entry = idlePool.splice(i, 1)[0];
      detachIdleListeners(entry);
      return entry;
    }
  }
  return null;
}

function returnToPool(worker, heapMegabytes, timezone) {
  if (idlePool.length >= MAX_IDLE_THREADS) {
    // Pool is full, terminate the oldest idle thread.
    const oldest = idlePool.shift();
    detachIdleListeners(oldest);
    void oldest.worker.terminate().catch(() => {});
  }
  const entry = {
    worker,
    heapMegabytes,
    timezone,
    returnedAt: Date.now(),
    onError: null,
    onExit: null,
  };
  // An idle Worker still emits lifecycle events. Keep the pool from turning
  // a later thread failure into an unhandled error or a stale pool entry.
  entry.onError = () => {
    if (!removeIdleEntry(entry)) return;
    detachIdleListeners(entry);
    void worker.terminate().catch(() => {});
  };
  entry.onExit = () => {
    removeIdleEntry(entry);
    detachIdleListeners(entry);
  };
  worker.once("error", entry.onError);
  worker.once("exit", entry.onExit);
  idlePool.push(entry);
  scheduleCleanup();
}

export class PooledWorkerThreadConnection extends ConnectionBase {
  constructor(limits) {
    super(limits);
    this.worker = null;
    this.heapMegabytes = resolveRuntimeHeapMegabytes(limits.maxHeapBytes);
    this.timezone = null;
    this.reused = false;
    this.postChain = Promise.resolve();
  }

  async start(initPayload) {
    if (this.worker !== null && this.ready) return;
    if (this.worker !== null) {
      throw new Error("Sandbox worker thread is already starting");
    }

    const timezone = initPayload.fingerprint.timezone;
    // Try to acquire an idle worker with warm SOURCE_CACHE.
    const idle = acquireIdleWorker(this.heapMegabytes, timezone);
    let worker;
    if (idle !== null) {
      worker = idle.worker;
      this.reused = true;
    } else {
      worker = new Worker(THREAD_ENTRY, {
        name: "edge-sandbox-runtime",
        execArgv: ["--experimental-vm-modules"],
        resourceLimits: {
          maxOldGenerationSizeMb: this.heapMegabytes,
        },
        env: threadEnvironment(timezone),
      });
      this.reused = false;
    }

    this.worker = worker;
    this.timezone = timezone;
    const reader = this.createFrameReader();
    worker.on("message", chunk => {
      reader.push(Buffer.from(
        chunk.buffer,
        chunk.byteOffset,
        chunk.byteLength,
      ));
    });
    worker.once("messageerror", error => this.handleExit(worker, error));
    worker.once("error", error => this.handleExit(worker, error));
    worker.once("exit", code => {
      this.handleExit(worker, threadExitError(code));
    });
    try {
      await this.rawRequest(
        Opcode.UPDATE_LIMITS,
        this.protocolLimits(),
        Math.max(this.limits.timeoutMs, MINIMUM_REALM_BOOTSTRAP_TIMEOUT_MS),
      );
      await this.rawRequest(
        Opcode.INIT,
        initPayload,
        Math.max(this.limits.timeoutMs, MINIMUM_REALM_BOOTSTRAP_TIMEOUT_MS),
      );
      this.ready = true;
    } catch (error) {
      // INIT 失败必须终止线程；否则 "already starting" 守卫永久阻塞重试，
      // 且远端线程句柄会拖住宿主退出（IKFD9M）。
      this.terminate(error);
      throw error;
    }
  }

  async request(opcode, payload, timeoutMs = this.limits.timeoutMs) {
    if (this.worker === null || !this.ready) {
      throw new Error("Sandbox worker thread has not been initialized");
    }
    return this.rawRequest(opcode, payload, timeoutMs);
  }

  sendFrame(frame, requestId) {
    const worker = this.worker;
    if (worker === null) return;
    // postMessage 无 drain 信号；用串行链在每次投递后让出事件循环，
    // 配合 ConnectionBase 的帧字节计量为 worker 队列提供有界背压。
    this.postChain = this.postChain.then(() => new Promise((resolve) => {
      setImmediate(() => {
        if (this.worker !== worker) {
          resolve();
          return;
        }
        try {
          worker.postMessage(frame);
        } catch (error) {
          this.terminate(error);
          this.reportConnectionExit(error);
        }
        resolve();
      });
    })).catch(() => {});
  }

  handleProtocolFailure(cause) {
    const error = new Error("Sandbox worker sent an invalid binary response", {
      cause,
    });
    error.name = "SandboxThreadProtocolError";
    error.code = "ERR_EDGE_THREAD_PROTOCOL";
    this.terminate(error);
    this.reportConnectionExit(error);
  }

  handleExit(worker, error) {
    if (this.worker !== worker) return;
    this.worker = null;
    this.ready = false;
    void worker.terminate().catch(() => {});
    this.rejectAllPending(error);
    this.reportConnectionExit(error);
  }

  /**
   * Graceful close: send CLOSE to clean up the realm, then return the
   * thread to the idle pool so the next sandbox reuses its warm cache.
   */
  async closeAndRecycle() {
    const worker = this.worker;
    if (worker === null) return;
    if (!this.ready) {
      // 失败态（INIT 失败 / 协议错误）同样要回收句柄，否则 close 也关不掉。
      this.terminate();
      return;
    }
    try {
      await this.rawRequest(
        Opcode.CLOSE,
        Object.create(null),
        this.limits.timeoutMs,
      );
    } catch {
      // If CLOSE fails, terminate instead of recycling.
      this.terminate();
      return;
    }
    // Detach the worker from this connection and return to pool.
    this.worker = null;
    this.ready = false;
    worker.removeAllListeners("message");
    worker.removeAllListeners("messageerror");
    worker.removeAllListeners("error");
    worker.removeAllListeners("exit");
    returnToPool(worker, this.heapMegabytes, this.timezone);
  }

  terminate(reason = threadExitError(null)) {
    const worker = this.worker;
    this.worker = null;
    this.ready = false;
    if (worker !== null) {
      void worker.terminate().catch(() => {});
    }
    this.rejectAllPending(reason);
  }
}

function threadEnvironment(timezone) {
  const environment = {
    NODE_NO_WARNINGS: "1",
    TZ: timezone,
  };
  if (process.platform === "win32") {
    environment.SystemRoot = process.env.SystemRoot;
    environment.WINDIR = process.env.WINDIR;
    environment.TEMP = process.env.TEMP;
    environment.TMP = process.env.TMP;
  }
  return environment;
}

/**
 * Immediately terminate all idle threads. Useful for clean process exit.
 */
export function drainWorkerThreadPool() {
  for (const entry of idlePool) {
    detachIdleListeners(entry);
    void entry.worker.terminate().catch(() => {});
  }
  idlePool.length = 0;
  if (cleanupTimer !== null) {
    clearTimeout(cleanupTimer);
    cleanupTimer = null;
  }
}
