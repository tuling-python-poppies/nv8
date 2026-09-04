import { moveHistory } from "../../../infra/navigation/navigation-state.js";
import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { History } from "./history-constructor.js";
import { requireHistory } from "./history-state.js";

export const back = {
  back() {
    requireHistory(this);
    moveHistory(-1);
    traceCall("window.History.prototype.back", "History", [], undefined);
  },
}.back;

registerNativeFunction(back, "back");

export function installHistoryBack() {
  definePrototypeMethod(History.prototype, "back", back);
}
