import { definePrototypeAccessor, definePrototypeGetter, definePrototypeMethod } from "../webidl/descriptor.js";
import { changed } from "../api/dom/cookie-change-event-changed-getter.js";
import {
  CookieChangeEvent,
  finishCookieChangeEventConstructor,
  installCookieChangeEventConstructor,
} from "../api/dom/cookie-change-event-constructor.js";
import { deleted } from "../api/dom/cookie-change-event-deleted-getter.js";
import {
  CookieStore,
  createCookieStore,
  finishCookieStoreConstructor,
  finishCookieStoreToStringTag,
  installCookieStoreConstructor,
} from "../api/dom/cookie-store-constructor.js";
import { deleteCookie } from "../api/dom/cookie-store-delete.js";
import { getAll } from "../api/dom/cookie-store-get-all.js";
import { get } from "../api/dom/cookie-store-get.js";
import { cookieStore, setGlobalCookieStore } from "../api/dom/cookie-store-global-getter.js";
import { onchange } from "../api/dom/cookie-store-onchange-getter.js";
import { setOnchange } from "../api/dom/cookie-store-onchange-setter.js";
import { set } from "../api/dom/cookie-store-set.js";

export function installCookie() {
  installCookieChangeEventConstructor();
  definePrototypeGetter(CookieChangeEvent.prototype, "changed", changed);
  definePrototypeGetter(CookieChangeEvent.prototype, "deleted", deleted);
  finishCookieChangeEventConstructor();
  installCookieStoreConstructor();
  definePrototypeMethod(CookieStore.prototype, "delete", deleteCookie);
  definePrototypeMethod(CookieStore.prototype, "get", get);
  definePrototypeMethod(CookieStore.prototype, "getAll", getAll);
  definePrototypeMethod(CookieStore.prototype, "set", set);
  finishCookieStoreConstructor();
  definePrototypeAccessor(CookieStore.prototype, "onchange", onchange, setOnchange);
  finishCookieStoreToStringTag();
  const store = createCookieStore();
  setGlobalCookieStore(store);
  Object.defineProperty(globalThis, "cookieStore", {
    get: cookieStore,
    enumerable: true,
    configurable: true,
  });
}
