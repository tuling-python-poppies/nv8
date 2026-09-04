import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function PerformanceEntry() {
  throw new TypeError(
    "Failed to construct 'PerformanceEntry': Illegal constructor",
  );
}

registerNativeFunction(PerformanceEntry, "PerformanceEntry");

export function installPerformanceEntryConstructor() {
  delete PerformanceEntry.prototype.constructor;
  defineToStringTag(PerformanceEntry.prototype, "PerformanceEntry");
  defineGlobalConstructor("PerformanceEntry", PerformanceEntry);
}

export function installPerformanceEntryConstructorBacklink() {
  defineConstructorBacklink(PerformanceEntry.prototype, PerformanceEntry);
}
