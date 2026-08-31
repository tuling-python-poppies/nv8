import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const clipboard = Object.getOwnPropertyDescriptor({
  get clipboard() {
    const value = navigatorService(this, "clipboard");
    traceGetter("window.Navigator.prototype.clipboard", "Navigator", value);
    return value;
  },
}, "clipboard").get;
registerNativeGetter(clipboard, "clipboard");
export function installNavigatorClipboard() {
  definePrototypeGetter(Navigator.prototype, "clipboard", clipboard);
}
