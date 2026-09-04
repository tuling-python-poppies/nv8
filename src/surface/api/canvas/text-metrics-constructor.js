import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function TextMetrics() {
  throw new TypeError("Failed to construct 'TextMetrics': Illegal constructor");
}
registerNativeFunction(TextMetrics, "TextMetrics");

export function installTextMetricsConstructor() {
  delete TextMetrics.prototype.constructor;
  defineGlobalConstructor("TextMetrics", TextMetrics);
}
