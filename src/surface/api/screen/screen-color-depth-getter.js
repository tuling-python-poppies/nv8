import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Screen } from "./screen-constructor.js";
import { requireScreen } from "./screen-state.js";

export const screenColorDepth = Object.getOwnPropertyDescriptor({
  get colorDepth() {
    const value = requireScreen(this).colorDepth;
    traceGetter("window.Screen.prototype.colorDepth", "Screen", value);
    return value;
  },
}, "colorDepth").get;

registerNativeGetter(screenColorDepth, "colorDepth");

export function installScreenColorDepth() {
  definePrototypeGetter(Screen.prototype, "colorDepth", screenColorDepth);
}
