import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Screen } from "./screen-constructor.js";
import { requireScreen } from "./screen-state.js";

export const screenAvailHeight = Object.getOwnPropertyDescriptor({
  get availHeight() {
    const value = requireScreen(this).availHeight;
    traceGetter("window.Screen.prototype.availHeight", "Screen", value);
    return value;
  },
}, "availHeight").get;

registerNativeGetter(screenAvailHeight, "availHeight");

export function installScreenAvailHeight() {
  definePrototypeGetter(Screen.prototype, "availHeight", screenAvailHeight);
}
