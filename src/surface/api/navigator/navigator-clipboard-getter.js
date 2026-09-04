import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
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
