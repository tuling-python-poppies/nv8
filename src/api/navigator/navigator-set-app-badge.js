import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const setAppBadge = {
  setAppBadge() {
    requireNavigator(this);
    if (arguments[0] !== undefined) {
      Number(arguments[0]);
    }
    const value = Promise.resolve(undefined);
    traceCall(
      "window.Navigator.prototype.setAppBadge",
      "Navigator",
      arguments.length === 0 ? [] : [arguments[0]],
      value,
    );
    return value;
  },
}.setAppBadge;
registerNativeFunction(setAppBadge, "setAppBadge");
export function installNavigatorSetAppBadge() {
  definePrototypeMethod(Navigator.prototype, "setAppBadge", setAppBadge);
}
