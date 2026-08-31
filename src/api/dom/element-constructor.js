import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Node } from "./node-constructor.js";

export function Element() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(Element, "Element");

export function installElementConstructor() {
  Object.setPrototypeOf(Element.prototype, Node.prototype);
  Object.setPrototypeOf(Element, Node);
  delete Element.prototype.constructor;
  defineGlobalConstructor("Element", Element);
}

export function finishElementConstructor() {
  defineConstructorBacklink(Element.prototype, Element);
  defineToStringTag(Element.prototype, "Element");
  Object.defineProperty(Element.prototype, Symbol.unscopables, {
    value: Object.freeze({
      after: true,
      append: true,
      before: true,
      prepend: true,
      remove: true,
      replaceChildren: true,
      replaceWith: true,
      slot: true,
    }),
    writable: false,
    enumerable: false,
    configurable: true,
  });
}
