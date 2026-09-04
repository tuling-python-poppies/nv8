import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { ScreenOrientation } from "./screen-orientation-constructor.js";
import { requireScreenOrientation } from "./screen-orientation-state.js";

export const unlock = {
  unlock() {
    const state = requireScreenOrientation(this);
    if (state.type.endsWith("secondary")) {
      state.type = state.type.replace("-secondary", "-primary");
      state.angle = 0;
    }
    traceCall(
      "window.ScreenOrientation.prototype.unlock",
      "ScreenOrientation",
      [],
      undefined,
    );
  },
}.unlock;

registerNativeFunction(unlock, "unlock");

export function installScreenOrientationUnlock() {
  definePrototypeMethod(ScreenOrientation.prototype, "unlock", unlock);
}
