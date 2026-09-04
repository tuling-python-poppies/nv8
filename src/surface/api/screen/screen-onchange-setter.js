import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireScreen } from "./screen-state.js";

export const screenOnchange = {
  screenOnchange(value) {
    requireScreen(this).onchange = value === null || value === undefined
      ? null
      : value;
    traceCall(
      "window.Screen.prototype.onchange",
      "Screen",
      [value],
      undefined,
    );
  },
}.screenOnchange;

Object.defineProperty(screenOnchange, "name", {
  value: "set onchange",
  configurable: true,
});
registerNativeFunction(screenOnchange, "set onchange");
