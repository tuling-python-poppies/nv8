export class SandboxTimeoutError extends Error {
  constructor(timeoutMs) {
    super(`Sandbox evaluation exceeded the ${timeoutMs}ms wall-clock timeout`);
    this.name = "SandboxTimeoutError";
    this.code = "ERR_EDGE_SANDBOX_TIMEOUT";
  }
}

export function createDeadline(timeoutMs, callback) {
  const timer = setTimeout(callback, timeoutMs);
  timer.unref?.();
  return () => clearTimeout(timer);
}
