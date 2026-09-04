import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const leaveAdInterestGroup = {
  leaveAdInterestGroup() {
    requireNavigator(this);
    const value = Promise.resolve(undefined);
    traceCall(
      "window.Navigator.prototype.leaveAdInterestGroup",
      "Navigator",
      arguments.length === 0 ? [] : [arguments[0]],
      value,
    );
    return value;
  },
}.leaveAdInterestGroup;
registerNativeFunction(leaveAdInterestGroup, "leaveAdInterestGroup");
export function installNavigatorLeaveAdInterestGroup() {
  definePrototypeMethod(
    Navigator.prototype,
    "leaveAdInterestGroup",
    leaveAdInterestGroup,
  );
}
