import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireScreen } from "./screen-state.js";

export const screenOnchange = Object.getOwnPropertyDescriptor({
  get onchange() {
    const value = requireScreen(this).onchange;
    traceGetter("window.Screen.prototype.onchange", "Screen", value);
    return value;
  },
}, "onchange").get;

registerNativeGetter(screenOnchange, "onchange");
