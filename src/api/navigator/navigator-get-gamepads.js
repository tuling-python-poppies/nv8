import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const getGamepads = {
  getGamepads() {
    requireNavigator(this);
    const value = [null, null, null, null];
    traceCall(
      "window.Navigator.prototype.getGamepads",
      "Navigator",
      [],
      value,
    );
    return value;
  },
}.getGamepads;
registerNativeFunction(getGamepads, "getGamepads");
export function installNavigatorGetGamepads() {
  definePrototypeMethod(Navigator.prototype, "getGamepads", getGamepads);
}
