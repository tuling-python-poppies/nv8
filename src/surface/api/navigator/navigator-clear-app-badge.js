import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const clearAppBadge = {
  clearAppBadge() {
    requireNavigator(this);
    const value = Promise.resolve(undefined);
    traceCall("window.Navigator.prototype.clearAppBadge", "Navigator", [], value);
    return value;
  },
}.clearAppBadge;
registerNativeFunction(clearAppBadge, "clearAppBadge");
export function installNavigatorClearAppBadge() {
  definePrototypeMethod(Navigator.prototype, "clearAppBadge", clearAppBadge);
}
