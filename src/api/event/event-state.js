import { monotonicNow } from "../../scheduler/monotonic-clock.js";
import { installEventIsTrustedOnInstance } from "./event-is-trusted-getter.js";

const eventState = new WeakMap();

export function initializeEvent(value, type, init) {
  eventState.set(value, {
    type,
    target: null,
    currentTarget: null,
    eventPhase: 0,
    bubbles: init.bubbles,
    cancelable: init.cancelable,
    composed: init.composed,
    defaultPrevented: false,
    propagationStopped: false,
    immediatePropagationStopped: false,
    inPassiveListener: false,
    dispatching: false,
    isTrusted: false,
    timeStamp: monotonicNow(),
    path: [],
  });
  // `isTrusted` 是 [LegacyUnforgeable]：定义在实例上而非原型上，
  // 且 configurable: false。真实 Edge 的 Event.prototype 上没有它。
  installEventIsTrustedOnInstance(value);
}

export function requireEvent(value) {
  const state = eventState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function isEvent(value) {
  return eventState.has(value);
}

export function markEventTrusted(value) {
  requireEvent(value).isTrusted = true;
}
