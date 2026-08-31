import {
  getScrollRestoration,
} from "../../navigation/navigation-state.js";
import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
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
