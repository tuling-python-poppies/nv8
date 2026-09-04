import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";
import { setCookieStoreInstance } from "./cookie-state.js";
import { initializeCookieStore } from "./cookie-store-state.js";

export function CookieStore() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CookieStore, "CookieStore");
export function installCookieStoreConstructor() {
  Object.setPrototypeOf(CookieStore.prototype, EventTarget.prototype);
  Object.setPrototypeOf(CookieStore, EventTarget);
  delete CookieStore.prototype.constructor;
  defineGlobalConstructor("CookieStore", CookieStore);
}
export function createCookieStore() {
  const store = Object.create(CookieStore.prototype);
  initializeCookieStore(store);
  setCookieStoreInstance(store);
  return store;
}
export function finishCookieStoreConstructor() {
  defineConstructorBacklink(CookieStore.prototype, CookieStore);
}
export function finishCookieStoreToStringTag() {
  defineToStringTag(CookieStore.prototype, "CookieStore");
}
