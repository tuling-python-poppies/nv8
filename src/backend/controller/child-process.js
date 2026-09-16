import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Buffer } from "node:buffer";
import { Opcode } from "../protocol/constants.js";
import { ConnectionBase } from "./connection-base.js";
import { resolveRuntimeHeapMegabytes } from "./runtime-heap-floor.js";

const CHILD_ENTRY = fileURLToPath(new URL("../child/entry.js", import.meta.url));
export const MINIMUM_REALM_BOOTSTRAP_TIMEOUT_MS = 5_000;
const CHILD_INSPECT_BRK_ENV = "EDGE_SANDBOX_CHILD_INSPECT_BRK";
const CHILD_STDERR_ENV = "EDGE_SANDBOX_CHILD_STDERR";
const STDERR_TAIL_BYTES = 4 * 1024;

function childInspectorArgument() {
  const value = process.env[CHILD_INSPECT_BRK_ENV];
  if (value === undefined || value === "") return null;
  if (!/^\d+$/.test(value)) {
    throw new TypeError(`${CHILD_INSPECT_BRK_ENV} must be a TCP port`);
  }
  const port = Number(value);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    throw new RangeError(`${CHILD_INSPECT_BRK_ENV} must be between 1 and 65535`);
  }
  return `--inspect-brk=127.0.0.1:${port}`;
}

function childEnvironment(timezone) {
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

export function childExitError(code, signal, stderrTail = Buffer.alloc(0)) {
  const signalText = signal ?? "none";
  const exitText = code ?? "none";
  const error = new Error(
    `Sandbox child exited before responding (code=${exitText}, signal=${signalText})`,
  );
  error.name = "SandboxChildExitError";
  // signal 与普通退出码是两类故障：SIGABRT/SIGKILL 通常意味着 V8 OOM 或
  // 宿主 OOM-killer，普通非零退出码通常意味着启动脚本自己失败。分开编码，
  // 上层才能按类型决策（见 IKF39Z-2）。
  error.code = signal === null || signal === undefined
    ? "ERR_EDGE_CHILD_EXIT"
    : "ERR_EDGE_CHILD_SIGNAL";
  error.exitCode = code ?? null;
  error.signal = signal ?? null;
  error.stderrTail = bufferToTailText(stderrTail);
  return error;
}

function bufferToTailText(tail) {
  if (tail === null || tail === undefined) return "";
  return Buffer.isBuffer(tail) ? tail.toString("utf8") : `${tail}`;
}

export function appendStderrTail(current, chunk) {
  const combined = current.length === 0
    ? Buffer.from(chunk)
    : Buffer.concat([current, chunk]);
  return combined.length <= STDERR_TAIL_BYTES
    ? combined
    : combined.subarray(combined.length - STDERR_TAIL_BYTES);
}

export class ChildProcessConnection extends ConnectionBase {
  constructor(limits) {
    super(limits);
    this.child = null;
    this.closing = false;
    this.stderrTail = Buffer.alloc(0);
    this.writeChain = Promise.resolve();
    this.releaseWriteChain = null;
  }

  releaseWriteBarrier() {
    const release = this.releaseWriteChain;
    this.releaseWriteChain = null;
    release?.();
  }

  createSpawnSpec(initPayload) {
    // 见 runtime-heap-floor.js：低于地板 V8 会在引导 Realm 时 OOM 并 abort，
    // 收到的是 SIGABRT 而不是结构化错误
    const heapMegabytes = resolveRuntimeHeapMegabytes(this.limits.maxHeapBytes);
    const inspectorArgument = childInspectorArgument();
    return {
      command: process.execPath,
      args: [
        ...(inspectorArgument === null ? [] : [inspectorArgument]),
        "--experimental-vm-modules",
        `--max-old-space-size=${heapMegabytes}`,
        CHILD_ENTRY,
      ],
      options: {
        cwd: fileURLToPath(new URL("../../../", import.meta.url)),
        env: childEnvironment(initPayload.fingerprint.timezone),
        windowsHide: true,
        stdio: ["pipe", "pipe", "pipe"],
      },
      forwardStderr: inspectorArgument !== null
        || process.env[CHILD_STDERR_ENV] === "1",
    };
  }

  async start(initPayload) {
    if (this.child !== null && this.ready) {
      return;
    }
    if (this.child !== null) {
      throw new Error("Sandbox child is already starting");
    }
    const spawnSpec = this.createSpawnSpec(initPayload);
    const child = spawn(
      spawnSpec.command,
      spawnSpec.args,
      spawnSpec.options,
    );
    this.child = child;
    this.closing = false;
    this.stderrTail = Buffer.alloc(0);
    const reader = this.createFrameReader();
    child.stdout.on("data", (chunk) => reader.push(chunk));
    child.stderr.on("data", (chunk) => {
      // stderr 始终留尾部快照供崩溃错误使用；默认不污染宿主输出。
      this.stderrTail = appendStderrTail(this.stderrTail, chunk);
      if (spawnSpec.forwardStderr) {
        process.stderr.write(chunk);
      }
    });
    child.once("error", (error) => this.handleExit(child, error));
    child.once("exit", (code, signal) => {
      this.handleExit(child, childExitError(code, signal, this.stderrTail));
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
      // INIT 失败（例如 Realm 引导报错或超时）必须回收进程，否则
      // "already starting" 守卫会让连接永久卡死（IKFD9M）。
      this.terminate(error);
      throw error;
    }
  }

  async request(opcode, payload, timeoutMs = this.limits.timeoutMs) {
    if (this.child === null || !this.ready) {
      throw new Error("Sandbox child has not been initialized");
    }
    return this.rawRequest(opcode, payload, timeoutMs);
  }

  sendFrame(frame, requestId) {
    const child = this.child;
    if (child === null) return;
    // stdin.write 返回 false 只代表内核缓冲区已满；继续同步写会无界堆积。
    // 串行链在前一帧真正落盘（write 回调 / drain）之后才提交下一帧。
    this.writeChain = this.writeChain.then(() => new Promise((resolve) => {
      if (this.child !== child) {
        resolve();
        return;
      }
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        if (this.releaseWriteChain === finish) this.releaseWriteChain = null;
        resolve();
      };
      this.releaseWriteChain = finish;
      let writable;
      try {
        writable = child.stdin.write(frame, (error) => {
          if (error && this.child === child) {
            this.terminate(error);
            this.reportConnectionExit(error);
          }
          finish();
        });
      } catch (error) {
        if (this.child === child) {
          this.terminate(error);
          this.reportConnectionExit(error);
        }
        finish();
        return;
      }
      if (writable === false) {
        child.stdin.once("drain", finish);
      }
    })).catch(() => {});
  }

  handleProtocolFailure(cause) {
    const error = new Error("Sandbox child sent an invalid binary response", { cause });
    error.name = "SandboxChildProtocolError";
    error.code = "ERR_EDGE_CHILD_PROTOCOL";
    this.terminate(error);
    this.reportConnectionExit(error);
  }

  handleExit(child, error) {
    if (this.child !== child) {
      return;
    }
    if (error !== null && error !== undefined && error.stderrTail === undefined) {
      error.stderrTail = bufferToTailText(this.stderrTail);
    }
    this.child = null;
    this.ready = false;
    child.stdin.destroy();
    child.stdout.destroy();
    child.stderr.destroy();
    child.kill();
    this.rejectAllPending(error);
    this.releaseWriteBarrier();
    this.reportConnectionExit(error);
  }

  terminate(reason = childExitError(null, "terminated")) {
    const child = this.child;
    this.child = null;
    this.ready = false;
    if (child !== null) {
      child.stdin.destroy();
      child.stdout.destroy();
      child.stderr.destroy();
      child.kill();
    }
    this.rejectAllPending(reason);
    this.releaseWriteBarrier();
  }
}
