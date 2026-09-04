import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeDialog } from "./html-dialog-element-state.js";

export function HTMLDialogElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLDialogElement, "HTMLDialogElement");

function createHTMLDialogElement(tagName, ownerDocument) {
  const element = Object.create(HTMLDialogElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeDialog(element);
  return element;
}

export function installHTMLDialogElementConstructor() {
  Object.setPrototypeOf(HTMLDialogElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLDialogElement, HTMLElement);
  delete HTMLDialogElement.prototype.constructor;
  defineGlobalConstructor("HTMLDialogElement", HTMLDialogElement);
  registerHTMLElementFactory("dialog", createHTMLDialogElement);
}
