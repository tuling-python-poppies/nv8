import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireEvent } from "./event-state.js";

/**
 * `Event.isTrusted` 的 getter。
 *
 * 与真实 Edge 151 对比（fixtures/fingerprint/edge-members.json）发现：
 *
 * ```
 * Object.getOwnPropertyNames(Event.prototype).includes('isTrusted')
 *   真实 Edge: false
 *   NV8 迁移前: true
 *
 * Object.getOwnPropertyNames(new Event('x')).includes('isTrusted')
 *   真实 Edge: true   descriptor: { get: function, configurable: false }
 * ```
 *
 * `isTrusted` 在 WebIDL 里标注为 `[LegacyUnforgeable]`——它定义在**每个实例**
 * 上而非原型上，且 `configurable: false`（因此无法被脚本删除或改写）。
 *
 * 放在原型上是可检测的差异：反检测脚本会检查 unforgeable 属性的位置。
 */
export const eventIsTrusted = {
  eventIsTrusted() {
    const value = requireEvent(this).isTrusted;
    traceGetter("window.Event.prototype.isTrusted", "Event", value);
    return value;
  },
}.eventIsTrusted;

registerNativeGetter(eventIsTrusted, "isTrusted");

/**
 * 在单个 Event 实例上安装 unforgeable `isTrusted`。
 *
 * 由 `initializeEvent()` 对每个新建 Event 调用。
 *
 * @param {object} event
 */
export function installEventIsTrustedOnInstance(event) {
  Object.defineProperty(event, "isTrusted", {
    get: eventIsTrusted,
    enumerable: true,
    // unforgeable：脚本不能删除或重定义它
    configurable: false,
  });
}

/**
 * 保留原有导出以免破坏调用方，但**不再**往原型上装。
 *
 * 真实浏览器的 Event.prototype 上没有 isTrusted。
 */
export function installEventIsTrusted() {
  // 有意为空：isTrusted 是 unforgeable，由 installEventIsTrustedOnInstance()
  // 在实例上安装。
}
