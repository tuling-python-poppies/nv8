import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const clearOriginJoinedAdInterestGroups = {
  clearOriginJoinedAdInterestGroups(owner) {
    requireNavigator(this);
    if (arguments.length === 0) {
      throw new TypeError("An owner origin is required");
    }
    const value = Promise.resolve(undefined);
    traceCall(
      "window.Navigator.prototype.clearOriginJoinedAdInterestGroups",
      "Navigator",
      [owner],
      value,
    );
    return value;
  },
}.clearOriginJoinedAdInterestGroups;
registerNativeFunction(
  clearOriginJoinedAdInterestGroups,
  "clearOriginJoinedAdInterestGroups",
);
export function installNavigatorClearOriginJoinedAdInterestGroups() {
  definePrototypeMethod(
    Navigator.prototype,
    "clearOriginJoinedAdInterestGroups",
    clearOriginJoinedAdInterestGroups,
  );
}
