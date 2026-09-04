import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import {
  requireNavigator,
  setVibrationPattern,
} from "./navigator-state.js";

export const vibrate = {
  vibrate(pattern) {
    requireNavigator(this);
    if (arguments.length === 0) {
      throw new TypeError(
        "Failed to execute 'vibrate' on 'Navigator': 1 argument required.",
      );
    }
    const source = Array.isArray(pattern) ? pattern : [pattern];
    const normalized = source.map((value) => {
      const number = Number(value);
      if (!Number.isFinite(number) || number <= 0) {
        return 0;
      }
      return Math.min(10_000, Math.trunc(number));
    });
    setVibrationPattern(this, normalized);
    traceCall(
      "window.Navigator.prototype.vibrate",
      "Navigator",
      [pattern],
      true,
    );
    return true;
  },
}.vibrate;
registerNativeFunction(vibrate, "vibrate");
export function installNavigatorVibrate() {
  definePrototypeMethod(Navigator.prototype, "vibrate", vibrate);
}
