import { historyState } from "../../../infra/navigation/navigation-state.js";
import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
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
