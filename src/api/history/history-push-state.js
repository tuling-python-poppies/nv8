import { pushHistoryState } from "../../navigation/navigation-state.js";
import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { History } from "./history-constructor.js";
import { requireHistory } from "./history-state.js";

export const pushState = {
  pushState(state, unused, url = undefined) {
    requireHistory(this);
    if (arguments.length < 2) {
      throw new TypeError(
        "Failed to execute 'pushState' on 'History': 2 arguments required.",
      );
    }
    const title = `${unused}`;
    pushHistoryState(state, title, url);
    traceCall(
      "window.History.prototype.pushState",
      "History",
      arguments.length < 3 ? [state, title] : [state, title, url],
      undefined,
    );
  },
}.pushState;

registerNativeFunction(pushState, "pushState");

export function installHistoryPushState() {
  definePrototypeMethod(History.prototype, "pushState", pushState);
}
