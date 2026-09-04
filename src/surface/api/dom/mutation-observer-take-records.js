import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { MutationObserver } from "./mutation-observer-constructor.js";
import { takeObserverRecords } from "./mutation-observer-state.js";

export const takeRecords = {
  takeRecords() {
    const result = takeObserverRecords(this);
    traceCall(
      "window.MutationObserver.prototype.takeRecords",
      "MutationObserver",
      [],
      result,
    );
    return result;
  },
}.takeRecords;
registerNativeFunction(takeRecords, "takeRecords");
export function installMutationObserverTakeRecords() {
  definePrototypeMethod(MutationObserver.prototype, "takeRecords", takeRecords);
}
