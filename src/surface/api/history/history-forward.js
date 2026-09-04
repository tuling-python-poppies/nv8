import { moveHistory } from "../../../infra/navigation/navigation-state.js";
import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { History } from "./history-constructor.js";
import { requireHistory } from "./history-state.js";

export const forward = {
  forward() {
    requireHistory(this);
    moveHistory(1);
    traceCall("window.History.prototype.forward", "History", [], undefined);
  },
}.forward;

registerNativeFunction(forward, "forward");

export function installHistoryForward() {
  definePrototypeMethod(History.prototype, "forward", forward);
}
