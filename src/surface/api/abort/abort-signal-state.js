import { Event } from "../event/event-constructor.js";
import { dispatchEvent } from "../event/event-target-dispatch-event.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { AbortSignal } from "./abort-signal-constructor.js";

const signalState = new WeakMap();

export function createAbortSignal(reason = undefined, aborted = false) {
  const signal = Object.create(AbortSignal.prototype);
  initializeEventTarget(signal);
  signalState.set(signal, {
    aborted,
    reason,
    onabort: null,
  });
  return signal;
}

export function requireAbortSignal(value) {
  const state = signalState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function abortSignal(signal, reason) {
  const state = requireAbortSignal(signal);
  if (state.aborted) {
    return;
  }
  state.aborted = true;
  state.reason = reason;
  const event = new Event("abort");
  Reflect.apply(dispatchEvent, signal, [event]);
  if (typeof state.onabort === "function") {
    try {
      Reflect.apply(state.onabort, signal, [event]);
    } catch {
      // Event handler exceptions do not escape abort().
    }
  }
}
