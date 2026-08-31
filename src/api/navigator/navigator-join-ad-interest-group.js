import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const joinAdInterestGroup = {
  joinAdInterestGroup(group) {
    requireNavigator(this);
    if (arguments.length === 0) {
      throw new TypeError("An interest group is required");
    }
    const value = Promise.resolve(undefined);
    traceCall(
      "window.Navigator.prototype.joinAdInterestGroup",
      "Navigator",
      [group, arguments[1]],
      value,
    );
    return value;
  },
}.joinAdInterestGroup;
registerNativeFunction(joinAdInterestGroup, "joinAdInterestGroup");
export function installNavigatorJoinAdInterestGroup() {
  definePrototypeMethod(
    Navigator.prototype,
    "joinAdInterestGroup",
    joinAdInterestGroup,
  );
}
