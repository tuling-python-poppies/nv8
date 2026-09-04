import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const keyboard = Object.getOwnPropertyDescriptor({
  get keyboard() {
    const value = navigatorService(this, "keyboard");
    traceGetter("window.Navigator.prototype.keyboard", "Navigator", value);
    return value;
  },
}, "keyboard").get;
registerNativeGetter(keyboard, "keyboard");
export function installNavigatorKeyboard() {
  definePrototypeGetter(Navigator.prototype, "keyboard", keyboard);
}
