import {
  setScrollRestoration,
} from "../../../infra/navigation/navigation-state.js";
import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireHistory } from "./history-state.js";

export const scrollRestoration = Object.getOwnPropertyDescriptor({
  set scrollRestoration(value) {
    requireHistory(this);
    const normalized = `${value}`;
    setScrollRestoration(normalized);
    traceCall(
      "window.History.prototype.scrollRestoration",
      "History",
      [normalized],
      undefined,
    );
  },
}, "scrollRestoration").set;

registerNativeFunction(scrollRestoration, "set scrollRestoration");
