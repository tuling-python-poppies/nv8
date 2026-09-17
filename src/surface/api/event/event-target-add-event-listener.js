import { traceCall } from "../../../infra/trace/trace-function.js";
import { toDOMString, toEventListenerOptions,
  requireArguments,
} from "../../../engine/webidl/conversions.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { EventTarget } from "./event-target-constructor.js";
import { requireEventTarget } from "./event-target-state.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";

export const addEventListener = {
  addEventListener(type, callback) {
  const foreignMethod = findCrossRealmPrototypeMethod(
    this,
    "addEventListener",
    addEventListener,
  );
  if (foreignMethod !== null) {
    return Reflect.apply(foreignMethod, this, arguments);
  }
  requireArguments(2, arguments.length, "addEventListener", "EventTarget");
  const state = requireEventTarget(this);
  const normalizedType = toDOMString(type);
  if (callback === null || callback === undefined) {
    traceCall(
      "window.EventTarget.prototype.addEventListener",
      "EventTarget",
      [normalizedType, callback],
      undefined,
    );
    return;
  }
  if (typeof callback !== "function" && typeof callback !== "object") {
    traceCall(
      "window.EventTarget.prototype.addEventListener",
      "EventTarget",
      [normalizedType, callback],
      undefined,
    );
    return;
  }
  const options = toEventListenerOptions(arguments[2]);
  if (options.signal?.aborted) return;
  let listeners = state.listeners.get(normalizedType);
  if (listeners === undefined) {
    listeners = [];
    state.listeners.set(normalizedType, listeners);
  }
  const duplicate = listeners.some((listener) => (
    listener.callback === callback && listener.capture === options.capture
  ));
  if (!duplicate) {
    const listener = {
      callback,
      capture: options.capture,
      once: options.once,
      passive: options.passive,
      removed: false,
      signal: options.signal,
      abortHandler: null,
    };
    if (options.signal !== null) {
      listener.abortHandler = () => {
        listener.removed = true;
        const current = state.listeners.get(normalizedType);
        const index = current?.indexOf(listener) ?? -1;
        if (index >= 0) current.splice(index, 1);
      };
      options.signal.addEventListener('abort', listener.abortHandler, { once: true });
    }
    listeners.push(listener);
  }
  traceCall(
    "window.EventTarget.prototype.addEventListener",
    "EventTarget",
    [normalizedType, callback],
    undefined,
  );

  },
}.addEventListener;

registerNativeFunction(addEventListener, "addEventListener");

export function installEventTargetAddEventListener() {
  definePrototypeMethod(
    EventTarget.prototype,
    "addEventListener",
    addEventListener,
  );
}
