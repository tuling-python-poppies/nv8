import { createRealmSlot } from "../../../engine/core/state-scope.js";
import { ErrorEvent } from "../general-events/general-events-runtime.js";
import { error as consoleError } from "../console/console-error.js";

const reportingExceptionSlot = createRealmSlot(() => false, "reporting-exception");

/**
 * HTML「report the exception」的 NV8 实现。
 *
 * 对齐真实 Edge 的可观察行为：
 * - 事件 `error` 在窗口上派发，`ErrorEvent.message` 带 `Uncaught ` 前缀
 *   （`throw new Error("x")` → `Uncaught Error: x`；`throw {a:1}` → `Uncaught #<Object>`）；
 * - `filename` / `lineno` / `colno` 取异常栈第一帧（抛出处）；
 * - `event.preventDefault()`（或 `window.onerror` 返回 true）取消默认动作
 *   ——默认动作就是 console 里的 `Uncaught ...` 记录；
 * - 监听器异常不向 `dispatchEvent` 调用方抛出（浏览器语义）；
 * - **error 事件处理期间再抛出的异常不再递归上报**，只进 console——
 *   否则一个坏的 onerror 处理器会自激成死循环。
 *
 * 这是监听器 / 定时器 / 微任务三个回调边界的公共出口。
 */
export function reportException(value) {
  const message = `Uncaught ${describeErrorText(value)}`;
  if (reportingExceptionSlot.get(globalThis)) {
    consoleError(message);
    return;
  }
  reportingExceptionSlot.set(globalThis, true);
  try {
    const { filename, lineno, colno } = exceptionLocation(value);
    const notCanceled = globalThis.dispatchEvent(new ErrorEvent("error", {
      message,
      filename,
      lineno,
      colno,
      error: value,
    }));
    if (notCanceled) {
      consoleError(message);
    }
  } finally {
    reportingExceptionSlot.set(globalThis, false);
  }
}

/**
 * 异常值的文本描述（不含 `Uncaught` 前缀）。V8 MessageFormatter 的近似：
 * Error/DOMException（DOMException 的原型链就是 Error）→ `Name: message`；
 * 对象 → `#<ClassName>`；数组/原始值 → 字符串化。
 */
export function describeErrorText(value) {
  if (value instanceof Error) {
    const name = `${value.name}`;
    const message = `${value.message ?? ""}`;
    return message === "" ? name : `${name}: ${message}`;
  }
  if (value === undefined || value === null) {
    return `${value}`;
  }
  if (typeof value !== "object" && typeof value !== "function") {
    return `${value}`;
  }
  if (Array.isArray(value)) {
    return `${value}`;
  }
  const name = value.constructor?.name;
  return typeof name === "string" && name !== "" ? `#<${name}>` : "#<Object>";
}

const STACK_FRAME = /at (?:(.+?) \()?([^()\s]+):(\d+):(\d+)\)?$/u;

function exceptionLocation(value) {
  const stack = typeof value?.stack === "string" ? value.stack : "";
  for (const line of stack.split(/\r?\n/u).slice(1)) {
    const match = STACK_FRAME.exec(line.trim());
    if (match === null) {
      continue;
    }
    return {
      filename: match[2],
      lineno: Number(match[3]),
      colno: Number(match[4]),
    };
  }
  return { filename: "", lineno: 0, colno: 0 };
}
