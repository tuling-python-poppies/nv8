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
        void entry.worker.terminate().catch(() => {});
      }
    }
    if (idlePool.length > 0) scheduleCleanup();
  }, IDLE_THREAD_TTL_MS);
  cleanupTimer.unref?.();
}

function acquireIdleWorker(heapMegabytes) {
  // Find a compatible idle worker (same heap limit).
  for (let i = 0; i < idlePool.length; i++) {
    if (idlePool[i].heapMegabytes === heapMegabytes) {
      return idlePool.splice(i, 1)[0];
    }
  }
  return null;
}

function returnToPool(worker, heapMegabytes) {
  if (idlePool.length >= MAX_IDLE_THREADS) {
    // Pool is full, terminate the oldest idle thread.
    const oldest = idlePool.shift();
    void oldest.worker.terminate().catch(() => {});
  }
  idlePool.push({ worker, heapMegabytes, returnedAt: Date.now() });
  scheduleCleanup();
}

export class PooledWorkerThreadConnection extends ConnectionBase {
  constructor(limits) {
    super(limits);
    this.worker = null;
    this.heapMegabytes = resolveRuntimeHeapMegabytes(limits.maxHeapBytes);
    this.reused = false;
  }

  async start(initPayload) {
    if (this.worker !== null && this.ready) return;
    if (this.worker !== null) {
      throw new Error("Sandbox worker thread is already starting");
    }

    // Try to acquire an idle worker with warm SOURCE_CACHE.
    const idle = acquireIdleWorker(this.heapMegabytes);
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
        env: threadEnvironment(initPayload.fingerprint.timezone),
      });
      this.reused = false;
    }

    this.worker = worker;
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
    await this.rawRequest(
      Opcode.INIT,
      initPayload,
      Math.max(this.limits.timeoutMs, MINIMUM_REALM_BOOTSTRAP_TIMEOUT_MS),
    );
    this.ready = true;
  }

  async request(opcode, payload, timeoutMs = this.limits.timeoutMs) {
    if (this.worker === null || !this.ready) {
      throw new Error("Sandbox worker thread has not been initialized");
    }
    return this.rawRequest(opcode, payload, timeoutMs);
  }

  sendFrame(frame, requestId) {
    try {
      this.worker.postMessage(frame);
    } catch (error) {
      this.rejectPending(requestId, error);
    }
  }

  handleProtocolFailure(cause) {
    const error = new Error("Sandbox worker sent an invalid binary response", {
      cause,
    });
    error.name = "SandboxThreadProtocolError";
    error.code = "ERR_EDGE_THREAD_PROTOCOL";
    this.terminate(error);
  }

  handleExit(worker, error) {
    if (this.worker !== worker) return;
    this.worker = null;
    this.ready = false;
    this.rejectAllPending(error);
  }

  /**
   * Graceful close: send CLOSE to clean up the realm, then return the
   * thread to the idle pool so the next sandbox reuses its warm cache.
   */
  async closeAndRecycle() {
    const worker = this.worker;
    if (worker === null || !this.ready) return;
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
    returnToPool(worker, this.heapMegabytes);
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
    void entry.worker.terminate().catch(() => {});
  }
  idlePool.length = 0;
  if (cleanupTimer !== null) {
    clearTimeout(cleanupTimer);
    cleanupTimer = null;
  }
}
