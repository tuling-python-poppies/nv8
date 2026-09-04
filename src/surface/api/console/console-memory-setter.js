import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export const memory = Object.getOwnPropertyDescriptor({
  set memory(value) {
    traceCall("window.console.memory", "console", [value], undefined);
  },
}, "memory").set;
registerNativeFunction(memory, "set memory");
