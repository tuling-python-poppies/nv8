import { moveHistory } from "../../navigation/navigation-state.js";
import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { History } from "./history-constructor.js";
import { requireHistory } from "./history-state.js";

export const go = {
  go(delta = 0) {
    requireHistory(this);
    const number = Number(delta);
    const normalized = Number.isFinite(number) ? Math.trunc(number) : 0;
    moveHistory(normalized);
    traceCall(
      "window.History.prototype.go",
      "History",
      arguments.length === 0 ? [] : [normalized],
      undefined,
    );
  },
}.go;

registerNativeFunction(go, "go");

export function installHistoryGo() {
  definePrototypeMethod(History.prototype, "go", go);
}
