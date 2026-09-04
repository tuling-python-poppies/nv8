import { traceCall } from "../../../infra/trace/trace-function.js";
import { toDOMString, toEventListenerOptions } from "../../../engine/webidl/conversions.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { EventTarget } from "./event-target-constructor.js";
import { requireEventTarget } from "./event-target-state.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";

export const removeEventListener = {
  removeEventListener(type, callback) {
  const foreignMethod = findCrossRealmPrototypeMethod(
    this,
    "removeEventListener",
    removeEventListener,
  );
  if (foreignMethod !== null) {
    return Reflect.apply(foreignMethod, this, arguments);
  }
  const state = requireEventTarget(this);
  const normalizedType = toDOMString(type);
  const options = toEventListenerOptions(arguments[2]);
  const listeners = state.listeners.get(normalizedType);
  if (listeners !== undefined) {
    for (const listener of listeners) {
      if (
        listener.callback === callback
        && listener.capture === options.capture
        && !listener.removed
      ) {
        listener.removed = true;
        break;
      }
    }
  }
  traceCall(
    "window.EventTarget.prototype.removeEventListener",
    "EventTarget",
    [normalizedType, callback],
    undefined,
  );

  },
}.removeEventListener;

registerNativeFunction(removeEventListener, "removeEventListener");

export function installEventTargetRemoveEventListener() {
  definePrototypeMethod(
    EventTarget.prototype,
    "removeEventListener",
    removeEventListener,
  );
}
