import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Event } from "./event-constructor.js";
import { requireEvent } from "./event-state.js";

export const composedPath = {
  composedPath() {
  const result = requireEvent(this).path.slice();
  traceCall(
    "window.Event.prototype.composedPath",
    "Event",
    [],
    result,
  );
  return result;

  },
}.composedPath;

registerNativeFunction(composedPath, "composedPath");

export function installEventComposedPath() {
  definePrototypeMethod(Event.prototype, "composedPath", composedPath);
}
