import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireButton } from "./html-button-element-state.js";
const commands = new WeakMap();
const builtins = new Set([
  "show-popover", "hide-popover", "toggle-popover",
  "show-modal", "close", "request-close",
]);
const descriptor = Object.getOwnPropertyDescriptor({
  get command() {
    requireButton(this);
    const result = commands.get(this) ?? "";
    traceGetter("window.HTMLButtonElement.prototype.command", "HTMLButtonElement", result);
    return result;
  },
  set command(value) {
    requireButton(this);
    const text = `${value}`;
    commands.set(this, text.startsWith("--") || builtins.has(text) ? text : "");
  },
}, "command");
export const command = descriptor.get;
export const setCommand = descriptor.set;
registerNativeGetter(command, "command");
registerNativeFunction(setCommand, "set command");
