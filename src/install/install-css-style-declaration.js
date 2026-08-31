import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  CSSStyleDeclaration,
  installCSSStyleDeclarationConstructor,
} from "../api/css/css-style-declaration-constructor.js";
import { cssText } from "../api/css/css-style-declaration-css-text-property.js";
import { length } from "../api/css/css-style-declaration-length-getter.js";
import { parentRule } from "../api/css/css-style-declaration-parent-rule-getter.js";
import { cssFloat } from "../api/css/css-style-declaration-css-float-property.js";
import { getPropertyPriority } from "../api/css/css-style-declaration-get-property-priority.js";
import { getPropertyValue } from "../api/css/css-style-declaration-get-property-value.js";
import { item } from "../api/css/css-style-declaration-item.js";
import { removeProperty } from "../api/css/css-style-declaration-remove-property.js";
import { setProperty } from "../api/css/css-style-declaration-set-property.js";
import { values } from "../api/css/css-style-declaration-values.js";

export function installCSSStyleDeclaration() {
  installCSSStyleDeclarationConstructor();
  definePrototypeAccessor(CSSStyleDeclaration.prototype, "cssText", cssText.get, cssText.set);
  definePrototypeGetter(CSSStyleDeclaration.prototype, "length", length);
  definePrototypeGetter(CSSStyleDeclaration.prototype, "parentRule", parentRule);
  definePrototypeAccessor(CSSStyleDeclaration.prototype, "cssFloat", cssFloat.get, cssFloat.set);
  definePrototypeMethod(CSSStyleDeclaration.prototype, "getPropertyPriority", getPropertyPriority);
  definePrototypeMethod(CSSStyleDeclaration.prototype, "getPropertyValue", getPropertyValue);
  definePrototypeMethod(CSSStyleDeclaration.prototype, "item", item);
  definePrototypeMethod(CSSStyleDeclaration.prototype, "removeProperty", removeProperty);
  definePrototypeMethod(CSSStyleDeclaration.prototype, "setProperty", setProperty);
  defineConstructorBacklink(CSSStyleDeclaration.prototype, CSSStyleDeclaration);
  defineToStringTag(CSSStyleDeclaration.prototype, "CSSStyleDeclaration");
  definePrototypeMethod(
    CSSStyleDeclaration.prototype,
    Symbol.iterator,
    values,
    "values",
    false,
  );
}
