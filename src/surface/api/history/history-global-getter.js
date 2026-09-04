import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { createHistory } from "./history-state.js";

export const globalHistory = Object.getOwnPropertyDescriptor({
  get history() {
    const value = createHistory();
    traceGetter("window.history", "Window", value);
    return value;
  },
}, "history").get;

registerNativeGetter(globalHistory, "history");
