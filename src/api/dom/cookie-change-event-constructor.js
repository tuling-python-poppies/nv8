import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Event } from "../event/event-constructor.js";
import { initializeEvent } from "../event/event-state.js";
import { initializeCookieChangeEvent } from "./cookie-change-event-state.js";

export function CookieChangeEvent(type) {
  if (new.target === undefined) throw new TypeError("Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  const init = arguments[1] ?? {};
  initializeEvent(this, `${type}`, {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  });
  initializeCookieChangeEvent(this, init);
}
registerNativeFunction(CookieChangeEvent, "CookieChangeEvent");
export function installCookieChangeEventConstructor() {
  Object.setPrototypeOf(CookieChangeEvent.prototype, Event.prototype);
  Object.setPrototypeOf(CookieChangeEvent, Event);
  delete CookieChangeEvent.prototype.constructor;
  defineGlobalConstructor("CookieChangeEvent", CookieChangeEvent);
}
export function finishCookieChangeEventConstructor() {
  defineConstructorBacklink(CookieChangeEvent.prototype, CookieChangeEvent);
  defineToStringTag(CookieChangeEvent.prototype, "CookieChangeEvent");
}
