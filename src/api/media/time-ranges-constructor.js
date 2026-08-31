import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
export function TimeRanges() {
  throw new TypeError(
    "Failed to construct 'TimeRanges': Illegal constructor",
  );
}
registerNativeFunction(TimeRanges, "TimeRanges");
export function installTimeRangesConstructor() {
  delete TimeRanges.prototype.constructor;
  defineGlobalConstructor("TimeRanges", TimeRanges);
}
