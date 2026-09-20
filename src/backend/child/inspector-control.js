import inspector from "node:inspector";
import { isMainThread } from "node:worker_threads";

const DEFAULT_HOST = "127.0.0.1";

/**
 * 打开承载 Realm 的子进程 inspector；CDP 直接走 Node 的 WebSocket。
 * ponytail: 仅支持 child-process；worker 有独立 isolate，需另接 worker 调试路由。
 * 必须 wait=false，才能先将 URL 回传给尚未连接的调试器。
 *
 * @param {{ port?: number, host?: string }} [options]
 * @returns {{ url: string, alreadyOpen: boolean }}
 */
export function openInspector(options = {}) {
  if (!isMainThread) {
    throw inspectorError(
      "ERR_EDGE_INSPECTOR_UNSUPPORTED",
      "Inspector is only available on the child-process backend. Relaunch with "
        + "execution.backend: 'child-process'.",
    );
  }
  const port = normalizePort(options?.port);
  const host = normalizeHost(options?.host);
  // 例如通过 EDGE_SANDBOX_CHILD_INSPECT_BRK 打开时，直接复用现有地址。
  const existing = inspector.url();
  if (typeof existing === "string" && existing.length > 0) {
    return { url: existing, alreadyOpen: true };
  }
  inspector.open(port, host, false);
  const url = inspector.url();
  if (typeof url !== "string" || url.length === 0) {
    throw inspectorError(
      "ERR_EDGE_INSPECTOR_NO_URL",
      "Inspector could not open a WebSocket endpoint; check the host and port",
    );
  }
  return { url, alreadyOpen: false };
}

function normalizePort(value) {
  if (value === undefined || value === null) return 0;
  if (!Number.isInteger(value) || value < 0 || value > 65_535) {
    throw inspectorError(
      "ERR_EDGE_INSPECTOR_PORT",
      "inspector port must be an integer in [0, 65535]",
    );
  }
  return value;
}

function normalizeHost(value) {
  if (value === undefined || value === null || value === "") return DEFAULT_HOST;
  if (typeof value !== "string") {
    throw inspectorError(
      "ERR_EDGE_INSPECTOR_HOST",
      "inspector host must be a string",
    );
  }
  return value;
}

function inspectorError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}
