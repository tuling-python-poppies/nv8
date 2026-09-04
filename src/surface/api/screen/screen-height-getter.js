import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Screen } from "./screen-constructor.js";
import { requireScreen } from "./screen-state.js";

export const screenHeight = Object.getOwnPropertyDescriptor({
  get height() {
    const value = requireScreen(this).height;
    traceGetter("window.Screen.prototype.height", "Screen", value);
    return value;
  },
}, "height").get;

registerNativeGetter(screenHeight, "height");

export function installScreenHeight() {
  definePrototypeGetter(Screen.prototype, "height", screenHeight);
}
