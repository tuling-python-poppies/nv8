import { definePrototypeAccessor, definePrototypeGetter, definePrototypeMethod } from "../webidl/descriptor.js";
import { add } from "../api/dom/dom-token-list-add.js";
import { contains } from "../api/dom/dom-token-list-contains.js";
import {
  finishDOMTokenListConstructor,
  installDOMTokenListConstructor,
  DOMTokenList,
} from "../api/dom/dom-token-list-constructor.js";
import { entries } from "../api/dom/dom-token-list-entries.js";
import { forEach } from "../api/dom/dom-token-list-for-each.js";
import { item } from "../api/dom/dom-token-list-item.js";
import { keys } from "../api/dom/dom-token-list-keys.js";
import { length } from "../api/dom/dom-token-list-length-getter.js";
import { remove } from "../api/dom/dom-token-list-remove.js";
import { replace } from "../api/dom/dom-token-list-replace.js";
import { supports } from "../api/dom/dom-token-list-supports.js";
import { toggle } from "../api/dom/dom-token-list-toggle.js";
import { toString } from "../api/dom/dom-token-list-to-string.js";
import { value } from "../api/dom/dom-token-list-value-getter.js";
import { setValue } from "../api/dom/dom-token-list-value-setter.js";
import { values } from "../api/dom/dom-token-list-values.js";

export function installDOMTokenList() {
  installDOMTokenListConstructor();
  definePrototypeMethod(DOMTokenList.prototype, "entries", entries);
  definePrototypeMethod(DOMTokenList.prototype, "keys", keys);
  definePrototypeMethod(DOMTokenList.prototype, "values", values);
  definePrototypeMethod(DOMTokenList.prototype, "forEach", forEach);
  definePrototypeGetter(DOMTokenList.prototype, "length", length);
  definePrototypeAccessor(DOMTokenList.prototype, "value", value, setValue);
  definePrototypeMethod(DOMTokenList.prototype, "add", add);
  definePrototypeMethod(DOMTokenList.prototype, "contains", contains);
  definePrototypeMethod(DOMTokenList.prototype, "item", item);
  definePrototypeMethod(DOMTokenList.prototype, "remove", remove);
  definePrototypeMethod(DOMTokenList.prototype, "replace", replace);
  definePrototypeMethod(DOMTokenList.prototype, "supports", supports);
  definePrototypeMethod(DOMTokenList.prototype, "toggle", toggle);
  definePrototypeMethod(DOMTokenList.prototype, "toString", toString);
  finishDOMTokenListConstructor();
  Object.defineProperty(DOMTokenList.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
