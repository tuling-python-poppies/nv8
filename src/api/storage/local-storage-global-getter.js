import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { currentLocalStorage } from "./storage-state.js";

export const localStorage = Object.getOwnPropertyDescriptor({
  get localStorage() {
    const value = currentLocalStorage();
    traceGetter("window.localStorage", "Window", value);
    return value;
  },
}, "localStorage").get;
registerNativeGetter(localStorage, "localStorage");
