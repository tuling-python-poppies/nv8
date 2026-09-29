import { PromiseRejectionEvent } from "../general-events/general-events-runtime.js";
import { markEventTrusted } from "./event-state.js";
import { error as consoleError } from "../console/console-error.js";
import { describeErrorText } from "./report-exception.js";

/**
 * Promise 拒绝生命周期的窗口事件（HTML「报告 Promise 拒绝」的 NV8 实现）。
 *
 * - 未处理拒绝 → `unhandledrejection`（cancelable）：`event.preventDefault()`
 *   取消默认动作——control 台里的 `Uncaught (in promise) ...`；
 * - 之后才被 `.catch` / `await` 接住 → `rejectionhandled`。
 *
 * 宿主（子进程 / 工作线程的 entry）监听 Node 的 `unhandledRejection` /
 * `rejectionHandled`，按 Realm 归属路由到这里；本模块只负责在 Realm 内派发。
 * 两个事件都是 UA 事件，`isTrusted === true`。
 */
const reportedReasons = new WeakMap();

export function reportUnhandledRejectionEvent(promise, reason) {
  reportedReasons.set(promise, reason);
  const event = new PromiseRejectionEvent(
    "unhandledrejection",
    { promise, reason, cancelable: true },
  );
  markEventTrusted(event);
  const notCanceled = globalThis.dispatchEvent(event);
  if (notCanceled) {
    consoleError(`Uncaught (in promise) ${describeErrorText(reason)}`);
  }
}

export function reportRejectionHandledEvent(promise, reason) {
  const stored = reportedReasons.get(promise);
  reportedReasons.delete(promise);
  const event = new PromiseRejectionEvent(
    "rejectionhandled",
    { promise, reason: reason ?? stored, cancelable: true },
  );
  markEventTrusted(event);
  globalThis.dispatchEvent(event);
}
