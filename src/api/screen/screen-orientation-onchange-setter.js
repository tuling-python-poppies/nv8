import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireScreenOrientation } from "./screen-orientation-state.js";

export const screenOrientationOnchange = {
  screenOrientationOnchange(value) {
    requireScreenOrientation(this).onchange =
      value === null || value === undefined ? null : value;
    traceCall(
      "window.ScreenOrientation.prototype.onchange",
      "ScreenOrientation",
      [value],
      undefined,
    );
  },
}.screenOrientationOnchange;

Object.defineProperty(screenOrientationOnchange, "name", {
  value: "set onchange",
  configurable: true,
});
registerNativeFunction(screenOrientationOnchange, "set onchange");
