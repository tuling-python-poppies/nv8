import { historyLength } from "../../../infra/navigation/navigation-state.js";
import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { History } from "./history-constructor.js";
import { requireHistory } from "./history-state.js";

export const length = Object.getOwnPropertyDescriptor({
  get length() {
    requireHistory(this);
    const value = historyLength();
    traceGetter("window.History.prototype.length", "History", value);
    return value;
  },
}, "length").get;

registerNativeGetter(length, "length");

export function installHistoryLength() {
  definePrototypeGetter(History.prototype, "length", length);
}
