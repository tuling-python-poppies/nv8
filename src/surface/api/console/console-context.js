import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { currentConsole } from "./console-state.js";

export const context = {
  context() {
    const value = currentConsole();
    traceCall("window.console.context", "console", Array.from(arguments), value);
    return value;
  },
}.context;
Object.defineProperty(context, "length", {
  value: 1,
  configurable: true,
});
registerNativeFunction(context, "context");
