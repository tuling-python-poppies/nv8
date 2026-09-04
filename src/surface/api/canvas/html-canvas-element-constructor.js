import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "../dom/html-element-constructor.js";
import {
  HTML_NAMESPACE,
  initializeElement,
} from "../dom/element-state.js";
import { initializeHTMLCanvasElement } from "./html-canvas-element-state.js";

export function HTMLCanvasElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLCanvasElement, "HTMLCanvasElement");

export function createHTMLCanvasElement(tagName, ownerDocument) {
  const canvas = Object.create(HTMLCanvasElement.prototype);
  initializeElement(canvas, tagName, ownerDocument, HTML_NAMESPACE);
  initializeHTMLCanvasElement(canvas);
  return canvas;
}

export function installHTMLCanvasElementConstructor() {
  Object.setPrototypeOf(HTMLCanvasElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLCanvasElement, HTMLElement);
  delete HTMLCanvasElement.prototype.constructor;
  defineGlobalConstructor("HTMLCanvasElement", HTMLCanvasElement);
  registerHTMLElementFactory("canvas", createHTMLCanvasElement);
}
