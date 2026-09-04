import {
  getScrollRestoration,
} from "../../../infra/navigation/navigation-state.js";
import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireHistory } from "./history-state.js";

export const scrollRestoration = Object.getOwnPropertyDescriptor({
  get scrollRestoration() {
    requireHistory(this);
    const value = getScrollRestoration();
    traceGetter(
      "window.History.prototype.scrollRestoration",
      "History",
      value,
    );
    return value;
  },
}, "scrollRestoration").get;

registerNativeGetter(scrollRestoration, "scrollRestoration");
