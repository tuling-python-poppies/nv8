import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Screen } from "./screen-constructor.js";
import { requireScreen } from "./screen-state.js";

export const screenWidth = Object.getOwnPropertyDescriptor({
  get width() {
    const value = requireScreen(this).width;
    traceGetter("window.Screen.prototype.width", "Screen", value);
    return value;
  },
}, "width").get;

registerNativeGetter(screenWidth, "width");

export function installScreenWidth() {
  definePrototypeGetter(Screen.prototype, "width", screenWidth);
}
