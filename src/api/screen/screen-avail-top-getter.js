import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Screen } from "./screen-constructor.js";
import { requireScreen } from "./screen-state.js";

export const screenAvailTop = Object.getOwnPropertyDescriptor({
  get availTop() {
    const value = requireScreen(this).availTop;
    traceGetter("window.Screen.prototype.availTop", "Screen", value);
    return value;
  },
}, "availTop").get;

registerNativeGetter(screenAvailTop, "availTop");

export function installScreenAvailTop() {
  definePrototypeGetter(Screen.prototype, "availTop", screenAvailTop);
}
