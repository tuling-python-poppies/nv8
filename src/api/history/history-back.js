import { moveHistory } from "../../navigation/navigation-state.js";
import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
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
