import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Screen } from "./screen-constructor.js";
import { requireScreen } from "./screen-state.js";

export const screenOrientation = Object.getOwnPropertyDescriptor({
  get orientation() {
    const value = requireScreen(this).orientation;
    traceGetter("window.Screen.prototype.orientation", "Screen", value);
    return value;
  },
}, "orientation").get;

registerNativeGetter(screenOrientation, "orientation");

export function installScreenOrientationGetter() {
  definePrototypeGetter(Screen.prototype, "orientation", screenOrientation);
}
