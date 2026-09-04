import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const share = {
  share() {
    requireNavigator(this);
    const data = arguments[0];
    if (data !== undefined && (data === null || typeof data !== "object")) {
      return Promise.reject(new TypeError("Share data must be an object"));
    }
    const value = Promise.resolve(undefined);
    traceCall(
      "window.Navigator.prototype.share",
      "Navigator",
      data === undefined ? [] : [data],
      value,
    );
    return value;
  },
}.share;
registerNativeFunction(share, "share");
export function installNavigatorShare() {
  definePrototypeMethod(Navigator.prototype, "share", share);
}
