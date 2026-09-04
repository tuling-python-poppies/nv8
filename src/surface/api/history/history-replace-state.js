import { replaceHistoryState } from "../../../infra/navigation/navigation-state.js";
import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { History } from "./history-constructor.js";
import { requireHistory } from "./history-state.js";

export const replaceState = {
  replaceState(state, unused, url = undefined) {
    requireHistory(this);
    if (arguments.length < 2) {
      throw new TypeError(
        "Failed to execute 'replaceState' on 'History': 2 arguments required.",
      );
    }
    const title = `${unused}`;
    replaceHistoryState(state, title, url);
    traceCall(
      "window.History.prototype.replaceState",
      "History",
      arguments.length < 3 ? [state, title] : [state, title, url],
      undefined,
    );
  },
}.replaceState;

registerNativeFunction(replaceState, "replaceState");

export function installHistoryReplaceState() {
  definePrototypeMethod(History.prototype, "replaceState", replaceState);
}
