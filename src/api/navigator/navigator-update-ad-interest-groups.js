import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const updateAdInterestGroups = {
  updateAdInterestGroups() {
    requireNavigator(this);
    const value = Promise.resolve(undefined);
    traceCall(
      "window.Navigator.prototype.updateAdInterestGroups",
      "Navigator",
      [],
      value,
    );
    return value;
  },
}.updateAdInterestGroups;
registerNativeFunction(updateAdInterestGroups, "updateAdInterestGroups");
export function installNavigatorUpdateAdInterestGroups() {
  definePrototypeMethod(
    Navigator.prototype,
    "updateAdInterestGroups",
    updateAdInterestGroups,
  );
}
