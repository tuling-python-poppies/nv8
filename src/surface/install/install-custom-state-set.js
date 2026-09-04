import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CustomStateSet,
  installCustomStateSetConstructor,
} from "../api/dom/custom-state-set-constructor.js";
import { size } from "../api/dom/custom-state-set-size-getter.js";
import { add } from "../api/dom/custom-state-set-add.js";
import { clear } from "../api/dom/custom-state-set-clear.js";
import { deleteState } from "../api/dom/custom-state-set-delete.js";
import { entries } from "../api/dom/custom-state-set-entries.js";
import { forEach } from "../api/dom/custom-state-set-for-each.js";
import { has } from "../api/dom/custom-state-set-has.js";
import { keys } from "../api/dom/custom-state-set-keys.js";
import { values } from "../api/dom/custom-state-set-values.js";

export function installCustomStateSet() {
  installCustomStateSetConstructor();
  definePrototypeGetter(CustomStateSet.prototype, "size", size);
  definePrototypeMethod(CustomStateSet.prototype, "add", add);
  definePrototypeMethod(CustomStateSet.prototype, "clear", clear);
  definePrototypeMethod(CustomStateSet.prototype, "delete", deleteState);
  definePrototypeMethod(CustomStateSet.prototype, "entries", entries);
  definePrototypeMethod(CustomStateSet.prototype, "forEach", forEach);
  definePrototypeMethod(CustomStateSet.prototype, "has", has);
  definePrototypeMethod(CustomStateSet.prototype, "keys", keys);
  definePrototypeMethod(CustomStateSet.prototype, "values", values);
  defineConstructorBacklink(CustomStateSet.prototype, CustomStateSet);
  defineToStringTag(CustomStateSet.prototype, "CustomStateSet");
  Object.defineProperty(CustomStateSet.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    configurable: true,
  });
}
