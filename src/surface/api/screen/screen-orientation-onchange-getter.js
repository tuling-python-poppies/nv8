import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireScreenOrientation } from "./screen-orientation-state.js";

export const screenOrientationOnchange = Object.getOwnPropertyDescriptor({
  get onchange() {
    const value = requireScreenOrientation(this).onchange;
    traceGetter(
      "window.ScreenOrientation.prototype.onchange",
      "ScreenOrientation",
      value,
    );
    return value;
  },
}, "onchange").get;

registerNativeGetter(screenOrientationOnchange, "onchange");
