import { traceConstruct } from "../../trace/trace-function.js";
import { toDOMString, toEventInit } from "../../webidl/conversions.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { initializeCustomEvent } from "./custom-event-state.js";
import { Event } from "./event-constructor.js";
import { initializeEvent } from "./event-state.js";

export function CustomEvent(type) {
  if (new.target === undefined) {
    throw new TypeError("Failed to construct 'CustomEvent': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  }
  if (arguments.length === 0) {
    throw new TypeError(
      "Failed to construct 'CustomEvent': 1 argument required, but only 0 present.",
    );
  }
  const normalizedType = toDOMString(type);
  const dictionary = arguments[1];
  const init = toEventInit(dictionary);
  const detail = dictionary === undefined || dictionary === null
    ? null
    : Object(dictionary).detail ?? null;
  initializeEvent(this, normalizedType, init);
  initializeCustomEvent(this, detail);
  traceConstruct(
    "window.CustomEvent",
    [normalizedType, dictionary],
    "CustomEvent",
  );
}

Object.setPrototypeOf(CustomEvent.prototype, Event.prototype);
Object.setPrototypeOf(CustomEvent, Event);
registerNativeFunction(CustomEvent, "CustomEvent");

export function installCustomEventConstructor() {
  delete CustomEvent.prototype.constructor;
  defineToStringTag(CustomEvent.prototype, "CustomEvent");
  defineGlobalConstructor("CustomEvent", CustomEvent);
}

export function installCustomEventConstructorBacklink() {
  defineConstructorBacklink(CustomEvent.prototype, CustomEvent);
}
