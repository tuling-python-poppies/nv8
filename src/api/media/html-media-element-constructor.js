import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { HTMLElement } from "../dom/html-element-constructor.js";

export function HTMLMediaElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLMediaElement, "HTMLMediaElement");

export function installHTMLMediaElementConstructor() {
  Object.setPrototypeOf(HTMLMediaElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLMediaElement, HTMLElement);
  delete HTMLMediaElement.prototype.constructor;
  defineGlobalConstructor("HTMLMediaElement", HTMLMediaElement);
}
