import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { traceConstruct } from "../../../infra/trace/trace-function.js";
import { initializeEventTarget } from "./event-target-state.js";

export function EventTarget() {
  if (new.target === undefined) {
    throw new TypeError("Failed to construct 'EventTarget': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  }
  initializeEventTarget(this);
  traceConstruct("window.EventTarget", [], "EventTarget");
}

registerNativeFunction(EventTarget, "EventTarget");

export function installEventTargetConstructor() {
  delete EventTarget.prototype.constructor;
  defineToStringTag(EventTarget.prototype, "EventTarget");
  defineGlobalConstructor("EventTarget", EventTarget);
}

export function installEventTargetConstructorBacklink() {
  defineConstructorBacklink(EventTarget.prototype, EventTarget);
}
