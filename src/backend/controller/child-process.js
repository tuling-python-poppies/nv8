import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Opcode } from "../protocol/constants.js";
import { ConnectionBase } from "./connection-base.js";
import { resolveRuntimeHeapMegabytes } from "./runtime-heap-floor.js";

const CHILD_ENTRY = fileURLToPath(new URL("../child/entry.js", import.meta.url));
export const MINIMUM_REALM_BOOTSTRAP_TIMEOUT_MS = 5_000;
const CHILD_INSPECT_BRK_ENV = "EDGE_SANDBOX_CHILD_INSPECT_BRK";
const CHILD_STDERR_ENV = "EDGE_SANDBOX_CHILD_STDERR";

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

function childExitError(code, signal) {
  const error = new Error(
    `Sandbox child exited before responding (code=${code ?? "none"}, signal=${signal ?? "none"})`,
  );
  error.name = "SandboxChildExitError";
  error.code = "ERR_EDGE_CHILD_EXIT";
  return error;
}

export class ChildProcessConnection extends ConnectionBase {
  constructor(limits) {
    super(limits);
    this.child = null;
    this.closing = false;
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
    const reader = this.createFrameReader();
    child.stdout.on("data", (chunk) => reader.push(chunk));
    child.stderr.on("data", (chunk) => {
      if (spawnSpec.forwardStderr) {
        process.stderr.write(chunk);
      }
    });
    child.once("error", (error) => this.handleExit(child, error));
    child.once("exit", (code, signal) => {
      this.handleExit(child, childExitError(code, signal));
    });
    await this.rawRequest(
      Opcode.INIT,
      initPayload,
      Math.max(this.limits.timeoutMs, MINIMUM_REALM_BOOTSTRAP_TIMEOUT_MS),
    );
    this.ready = true;
  }

  async request(opcode, payload, timeoutMs = this.limits.timeoutMs) {
    if (this.child === null || !this.ready) {
      throw new Error("Sandbox child has not been initialized");
    }
    return this.rawRequest(opcode, payload, timeoutMs);
  }

  sendFrame(frame, requestId) {
    this.child.stdin.write(frame, (error) => {
      if (error) {
        this.rejectPending(requestId, error);
      }
    });
  }

  handleProtocolFailure(cause) {
    const error = new Error("Sandbox child sent an invalid binary response", { cause });
    error.name = "SandboxChildProtocolError";
    error.code = "ERR_EDGE_CHILD_PROTOCOL";
    this.terminate(error);
  }

  handleExit(child, error) {
    if (this.child !== child) {
      return;
    }
    this.child = null;
    this.ready = false;
    this.rejectAllPending(error);
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
  }
}
