import { traceCall } from "../../../infra/trace/trace-function.js";
import { toDOMString } from "../../../engine/webidl/conversions.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { addEventListener } from "./event-target-add-event-listener.js";
import { EventTarget } from "./event-target-constructor.js";
import {
  eventTargetReceiver,
  requireEventTarget,
} from "./event-target-state.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";

export const when = {
  when(type) {
  const foreignMethod = findCrossRealmPrototypeMethod(this, "when", when);
  if (foreignMethod !== null) {
    return Reflect.apply(foreignMethod, this, arguments);
  }
  const target = eventTargetReceiver(this);
  requireEventTarget(target);
  const normalizedType = toDOMString(type);
  const promise = new Promise((resolve) => {
    function resolveEvent(event) {
      resolve(event);
    }
    Reflect.apply(addEventListener, target, [
      normalizedType,
      resolveEvent,
      { once: true },
    ]);
  });
  traceCall(
    "window.EventTarget.prototype.when",
    "EventTarget",
    [normalizedType],
    promise,
  );
  return promise;

  },
}.when;

registerNativeFunction(when, "when");

export function installEventTargetWhen() {
  definePrototypeMethod(EventTarget.prototype, "when", when);
}
