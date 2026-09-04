import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { CSSStyleDeclaration } from "./css-style-declaration-constructor.js";
import {
  initializeCSSStyleDeclaration,
  requireCSSStyleDeclaration,
} from "./css-style-declaration-state.js";

export function CSSPositionTryDescriptors() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CSSPositionTryDescriptors, "CSSPositionTryDescriptors");

export const descriptorProperties = [
  "margin", "marginTop", "marginRight", "marginBottom", "marginLeft",
  "marginBlock", "marginBlockStart", "marginBlockEnd", "marginInline",
  "marginInlineStart", "marginInlineEnd", "margin-top", "margin-right",
  "margin-bottom", "margin-left", "margin-block", "margin-block-start",
  "margin-block-end", "margin-inline", "margin-inline-start", "margin-inline-end",
  "inset", "insetBlock", "insetBlockStart", "insetBlockEnd", "insetInline",
  "insetInlineStart", "insetInlineEnd", "top", "left", "right", "bottom",
  "inset-block", "inset-block-start", "inset-block-end", "inset-inline",
  "inset-inline-start", "inset-inline-end", "width", "minWidth", "maxWidth",
  "height", "minHeight", "maxHeight", "blockSize", "minBlockSize",
  "maxBlockSize", "inlineSize", "minInlineSize", "maxInlineSize", "min-width",
  "max-width", "min-height", "max-height", "block-size", "min-block-size",
  "max-block-size", "inline-size", "min-inline-size", "max-inline-size",
  "placeSelf", "alignSelf", "justifySelf", "place-self", "align-self",
  "justify-self", "positionAnchor", "position-anchor", "positionArea",
  "position-area",
];

export function createCSSPositionTryDescriptors(initialText = "", parentRule = null) {
  const declaration = Object.create(CSSPositionTryDescriptors.prototype);
  return initializeCSSStyleDeclaration(declaration, null, initialText, parentRule);
}

export function installCSSPositionTryDescriptorsConstructor() {
  Object.setPrototypeOf(CSSPositionTryDescriptors.prototype, CSSStyleDeclaration.prototype);
  Object.setPrototypeOf(CSSPositionTryDescriptors, CSSStyleDeclaration);
  delete CSSPositionTryDescriptors.prototype.constructor;
  defineGlobalConstructor("CSSPositionTryDescriptors", CSSPositionTryDescriptors);
}

export function createPositionDescriptorGetter(name) {
  const property = name.includes("-") ? name : camelToKebab(name);
  const getter = function () {
    const declaration = requireCSSStyleDeclaration(this);
    void declaration;
    return this.getPropertyValue(property);
  };
  registerNativeGetter(getter, name);
  return getter;
}

function camelToKebab(value) {
  return value.replace(/[A-Z]/gu, letter => `-${letter.toLowerCase()}`);
}
