import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { createHistory } from "./history-state.js";

export const globalHistory = Object.getOwnPropertyDescriptor({
  get history() {
    const value = createHistory();
    traceGetter("window.history", "Window", value);
    return value;
  },
}, "history").get;

registerNativeGetter(globalHistory, "history");
