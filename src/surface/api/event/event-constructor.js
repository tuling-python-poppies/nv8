import { traceConstruct } from "../../../infra/trace/trace-function.js";
import { toDOMString, toEventInit } from "../../../engine/webidl/conversions.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { initializeEvent } from "./event-state.js";

export function Event(type) {
  if (new.target === undefined) {
    throw new TypeError("Failed to construct 'Event': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  }
  if (arguments.length === 0) {
    throw new TypeError(
      "Failed to construct 'Event': 1 argument required, but only 0 present.",
    );
  }
  const normalizedType = toDOMString(type);
  const init = toEventInit(arguments[1]);
  initializeEvent(this, normalizedType, init);
  traceConstruct("window.Event", [normalizedType, arguments[1]], "Event");
}

registerNativeFunction(Event, "Event");

export function installEventConstructor() {
  delete Event.prototype.constructor;
  defineToStringTag(Event.prototype, "Event");
  defineGlobalConstructor("Event", Event);
}

export function installEventConstants() {
  defineEventConstant("NONE", 0);
  defineEventConstant("CAPTURING_PHASE", 1);
  defineEventConstant("AT_TARGET", 2);
  defineEventConstant("BUBBLING_PHASE", 3);
}

export function installEventConstructorBacklink() {
  defineConstructorBacklink(Event.prototype, Event);
}

function defineEventConstant(name, value) {
  Object.defineProperty(Event, name, {
    value,
    enumerable: true,
  });
  Object.defineProperty(Event.prototype, name, {
    value,
    enumerable: true,
  });
}
