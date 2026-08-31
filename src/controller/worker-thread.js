import { Buffer } from "node:buffer";
import { Worker } from "node:worker_threads";
import { Opcode } from "../protocol/constants.js";
import { ConnectionBase } from "./connection-base.js";
import { MINIMUM_REALM_BOOTSTRAP_TIMEOUT_MS } from "./child-process.js";
import { resolveRuntimeHeapMegabytes } from "./runtime-heap-floor.js";

const THREAD_ENTRY = new URL("../thread/entry.js", import.meta.url);

function threadExitError(code) {
  const error = new Error(
    `Sandbox worker thread exited before responding (code=${code ?? "none"})`,
  );
  error.name = "SandboxThreadExitError";
  error.code = "ERR_EDGE_THREAD_EXIT";
  return error;
}

export class WorkerThreadConnection extends ConnectionBase {
  constructor(limits) {
    super(limits);
    this.worker = null;
  }

  async start(initPayload) {
    if (this.worker !== null && this.ready) return;
    if (this.worker !== null) {
      throw new Error("Sandbox worker thread is already starting");
    }
    // 与 child-process 用同一地板，两种后端行为必须一致
    const heapMegabytes = resolveRuntimeHeapMegabytes(this.limits.maxHeapBytes);
    const worker = new Worker(THREAD_ENTRY, {
      name: "edge-sandbox-runtime",
      execArgv: ["--experimental-vm-modules"],
      resourceLimits: {
        maxOldGenerationSizeMb: heapMegabytes,
      },
      env: threadEnvironment(initPayload.fingerprint.timezone),
    });
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
