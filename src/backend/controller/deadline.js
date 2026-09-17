export class SandboxTimeoutError extends Error {
  constructor(timeoutMs) {
    super(`Sandbox evaluation exceeded the ${timeoutMs}ms wall-clock timeout`);
    this.name = "SandboxTimeoutError";
    this.code = "ERR_EDGE_SANDBOX_TIMEOUT";
  }
}

export function createDeadline(timeoutMs, callback) {
  // 不 unref：deadline 是**必须兑现**的等待边界（调用方 await 它的结果）。
  // unref 会让短命进程在计时器触发前直接退出，把超时错误变成静默丢失
  // （与 Collector F10 同类）。计时器在请求收口时由调用方 clear 掉。
  const timer = setTimeout(callback, timeoutMs);
  return () => clearTimeout(timer);
}
