import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireEvent, isEvent } from "./event-state.js";
import { EventTarget } from "./event-target-constructor.js";
import {
  eventTargetReceiver,
  initializeEventTarget,
  isEventTarget,
  requireEventTarget,
} from "./event-target-state.js";
import { isNode, requireNode, rootOf } from "../dom/node-state.js";
import { requireArguments } from "../../../engine/webidl/conversions.js";

export function ensureEventTarget(value) {
  const receiver = eventTargetReceiver(value);
  if (!isEventTarget(receiver)) initializeEventTarget(receiver);
}

export const dispatchEvent = {
  dispatchEvent(event) {
    // 个数检查必须在类型检查之前：真实浏览器对 `dispatchEvent()` 报
    // "1 argument required"，而不是 "parameter 1 is not of type 'Event'"
    requireArguments(1, arguments.length, "dispatchEvent", "EventTarget");
    const receiver = eventTargetReceiver(this);
    if (isNode(receiver) && !isEventTarget(receiver)) {
      initializeEventTarget(receiver);
    }
    if (isNode(receiver) && receiver.nodeType === 9 && !isEventTarget(globalThis)) {
      initializeEventTarget(globalThis);
    }
    requireEventTarget(receiver);
    if (!isEvent(event)) {
      throw new TypeError(
        "Failed to execute 'dispatchEvent' on 'EventTarget': parameter 1 is not of type 'Event'.",
      );
    }
    const eventRecord = requireEvent(event);
    if (eventRecord.dispatching || eventRecord.eventPhase !== 0) {
      throw new DOMException(
        "The event is already being dispatched.",
        "InvalidStateError",
      );
    }
    const originalTarget = receiver;
    const path = eventPath(originalTarget, eventRecord.composed);
    eventRecord.dispatching = true;
    eventRecord.target = originalTarget;
    eventRecord.currentTarget = null;
    eventRecord.propagationStopped = false;
    eventRecord.immediatePropagationStopped = false;
    eventRecord.path = path.slice();

    try {
      for (let index = path.length - 1; index >= 1; index -= 1) {
        if (eventRecord.propagationStopped) {
          break;
        }
        eventRecord.eventPhase = 1;
        invokeListeners(
          path[index],
          event,
          eventRecord,
          originalTarget,
          true,
        );
      }
      if (!eventRecord.propagationStopped) {
        eventRecord.eventPhase = 2;
        invokeListeners(
          originalTarget,
          event,
          eventRecord,
          originalTarget,
          true,
        );
        if (!eventRecord.immediatePropagationStopped) {
          invokeListeners(
            originalTarget,
            event,
            eventRecord,
            originalTarget,
            false,
          );
        }
      }
      if (eventRecord.bubbles && !eventRecord.propagationStopped) {
        for (let index = 1; index < path.length; index += 1) {
          if (eventRecord.propagationStopped) {
            break;
          }
          eventRecord.eventPhase = 3;
          invokeListeners(
            path[index],
            event,
            eventRecord,
            originalTarget,
            false,
          );
        }
      }
    } finally {
      eventRecord.target = originalTarget;
      eventRecord.currentTarget = null;
      eventRecord.eventPhase = 0;
      eventRecord.inPassiveListener = false;
      eventRecord.dispatching = false;
    }
    const result = !eventRecord.defaultPrevented;
    traceCall(
      "window.EventTarget.prototype.dispatchEvent",
      "EventTarget",
      [event],
      result,
    );
    return result;

  },
}.dispatchEvent;

registerNativeFunction(dispatchEvent, "dispatchEvent");

export function installEventTargetDispatchEvent() {
  definePrototypeMethod(
    EventTarget.prototype,
    "dispatchEvent",
    dispatchEvent,
  );
}

function eventPath(target, composed) {
  const path = [target];
  if (!isNode(target)) {
    return path;
  }
  let current = target;
  for (;;) {
    const state = requireNode(current);
    if (state.parent !== null) {
      current = state.parent;
      path.push(current);
      continue;
    }
    if (state.host !== undefined) {
      if (!composed) {
        break;
      }
      current = state.host;
      path.push(current);
      continue;
    }
    if (state.nodeType === 9) {
      path.push(globalThis);
    }
    break;
  }
  return path;
}

function invokeListeners(
  currentTarget,
  event,
  eventRecord,
  originalTarget,
  capture,
) {
  const listeners = requireEventTarget(currentTarget).listeners.get(
    eventRecord.type,
  );
  if (listeners === undefined) {
    return;
  }
  eventRecord.currentTarget = currentTarget;
  eventRecord.target = retarget(originalTarget, currentTarget);
  for (const listener of listeners.slice()) {
    if (
      listener.removed
      || listener.capture !== capture
      || eventRecord.immediatePropagationStopped
    ) {
      continue;
    }
    if (listener.once) {
      // once 也要真删除：只标 removed 会让「触发后重新 add」被判重而失效。
      // 遍历的是 listeners.slice()，此处从原数组删除不影响快照。
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
      listener.removed = true;
      listener.signal?.removeEventListener?.('abort', listener.abortHandler);
    }
    eventRecord.inPassiveListener = listener.passive;
    try {
      if (typeof listener.callback === "function") {
        Reflect.apply(listener.callback, currentTarget, [event]);
      } else {
        const handleEvent = listener.callback.handleEvent;
        if (typeof handleEvent === "function") {
          Reflect.apply(handleEvent, listener.callback, [event]);
        }
      }
    } catch {
      // Browser dispatch reports listener errors without throwing.
    } finally {
      eventRecord.inPassiveListener = false;
    }
  }
}

function retarget(target, currentTarget) {
  let candidate = target;
  while (isNode(candidate)) {
    const root = rootOf(candidate);
    const rootState = requireNode(root);
    if (rootState.host === undefined) {
      return candidate;
    }
    if (isNode(currentTarget) && rootOf(currentTarget) === root) {
      return candidate;
    }
    candidate = rootState.host;
  }
  return candidate;
}
