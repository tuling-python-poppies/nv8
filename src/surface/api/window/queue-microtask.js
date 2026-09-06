import { traceCall } from "../../../infra/trace/trace-function.js";
import { defineGlobalFunction } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  captureScheduledCallbackIncumbent,
  notifyScheduledCallbackIncumbent,
} from "./window-messaging.js";

export const queueMicrotask = {
  queueMicrotask(callback) {
    if (arguments.length === 0) {
      throw new TypeError(
        "Failed to execute 'queueMicrotask' on 'Window': 1 argument required, but only 0 present.",
      );
    }
    if (typeof callback !== "function") {
      throw new TypeError(
        "Failed to execute 'queueMicrotask' on 'Window': parameter 1 is not of type 'Function'.",
      );
    }
    const incumbentSource = captureScheduledCallbackIncumbent();
    Promise.resolve().then(() => {
      notifyScheduledCallbackIncumbent(incumbentSource);
      callback();
    }).catch(() => {
      // Browser hosts report microtask exceptions through their error channel.
    });
    traceCall("window.queueMicrotask", "Window", [callback], undefined);
  },
}.queueMicrotask;

registerNativeFunction(queueMicrotask, "queueMicrotask");

export function installQueueMicrotask() {
  defineGlobalFunction("queueMicrotask", queueMicrotask);
}
