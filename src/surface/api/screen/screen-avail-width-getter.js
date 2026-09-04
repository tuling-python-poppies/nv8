import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Screen } from "./screen-constructor.js";
import { requireScreen } from "./screen-state.js";

export const screenAvailWidth = Object.getOwnPropertyDescriptor({
  get availWidth() {
    const value = requireScreen(this).availWidth;
    traceGetter("window.Screen.prototype.availWidth", "Screen", value);
    return value;
  },
}, "availWidth").get;

registerNativeGetter(screenAvailWidth, "availWidth");

export function installScreenAvailWidth() {
  definePrototypeGetter(Screen.prototype, "availWidth", screenAvailWidth);
}
