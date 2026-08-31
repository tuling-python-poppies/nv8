import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Screen } from "./screen-constructor.js";
import { requireScreen } from "./screen-state.js";

export const screenPixelDepth = Object.getOwnPropertyDescriptor({
  get pixelDepth() {
    const value = requireScreen(this).pixelDepth;
    traceGetter("window.Screen.prototype.pixelDepth", "Screen", value);
    return value;
  },
}, "pixelDepth").get;

registerNativeGetter(screenPixelDepth, "pixelDepth");

export function installScreenPixelDepth() {
  definePrototypeGetter(Screen.prototype, "pixelDepth", screenPixelDepth);
}
