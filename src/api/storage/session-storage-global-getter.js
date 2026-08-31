import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { currentSessionStorage } from "./storage-state.js";

export const sessionStorage = Object.getOwnPropertyDescriptor({
  get sessionStorage() {
    const value = currentSessionStorage();
    traceGetter("window.sessionStorage", "Window", value);
    return value;
  },
}, "sessionStorage").get;
registerNativeGetter(sessionStorage, "sessionStorage");
