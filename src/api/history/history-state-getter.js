import { historyState } from "../../navigation/navigation-state.js";
import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { History } from "./history-constructor.js";
import { requireHistory } from "./history-state.js";

export const state = Object.getOwnPropertyDescriptor({
  get state() {
    requireHistory(this);
    const value = historyState();
    traceGetter("window.History.prototype.state", "History", value);
    return value;
  },
}, "state").get;

registerNativeGetter(state, "state");

export function installHistoryState() {
  definePrototypeGetter(History.prototype, "state", state);
}
