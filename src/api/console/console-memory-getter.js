import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { currentMemoryInfo } from "./console-state.js";

export const memory = Object.getOwnPropertyDescriptor({
  get memory() {
    const value = currentMemoryInfo();
    traceGetter("window.console.memory", "console", value);
    return value;
  },
}, "memory").get;
registerNativeGetter(memory, "memory");
