import * as runtime from "../navigator-services-runtime.js";
import { NetworkInformation } from "../navigator-services-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

/**
 * `NetworkInformation.type` —— 桌面平台**不暴露**。
 *
 * 与真实 Edge 151 对比（fixtures/fingerprint/edge-members.json）：
 *
 * ```
 * 真实 Edge NetworkInformation.prototype:
 *   constructor, downlink, effectiveType, onchange, rtt, saveData
 * ```
 *
 * 没有 `type`。这是 Network Information API 的旧属性，Chromium 只在 Android
 * 上暴露，桌面版不暴露。NV8 模拟的是桌面 Edge，暴露它就是多出一个真实浏览器
 * 没有的成员——可检测特征。
 *
 * 实现保留在 `installNetworkInformationTypeForMobile()` 里，将来若要支持移动
 * 端 profile 可直接启用。
 */
export function install() {
  // 有意为空：桌面 Edge 不暴露 NetworkInformation.type
}

/**
 * 移动端 profile 用的安装函数。当前没有调用方。
 */
export function installNetworkInformationTypeForMobile() {
  installDispatchedAccessor(
    NetworkInformation,
    "type",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}
