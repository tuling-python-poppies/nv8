import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Screen } from "./screen-constructor.js";
import { requireScreen } from "./screen-state.js";

export const screenAvailLeft = Object.getOwnPropertyDescriptor({
  get availLeft() {
    const value = requireScreen(this).availLeft;
    traceGetter("window.Screen.prototype.availLeft", "Screen", value);
    return value;
  },
}, "availLeft").get;

registerNativeGetter(screenAvailLeft, "availLeft");

export function installScreenAvailLeft() {
  definePrototypeGetter(Screen.prototype, "availLeft", screenAvailLeft);
}
