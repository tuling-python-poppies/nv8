import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const virtualKeyboard = Object.getOwnPropertyDescriptor({
  get virtualKeyboard() {
    const value = navigatorService(this, "virtualKeyboard");
    traceGetter("window.Navigator.prototype.virtualKeyboard", "Navigator", value);
    return value;
  },
}, "virtualKeyboard").get;
registerNativeGetter(virtualKeyboard, "virtualKeyboard");
export function installNavigatorVirtualKeyboard() {
  definePrototypeGetter(Navigator.prototype, "virtualKeyboard", virtualKeyboard);
}
