import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { registerHTMLElementFactory } from "../dom/html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "../dom/element-state.js";
import { HTMLMediaElement } from "./html-media-element-constructor.js";
import { initializeMediaElement } from "./html-media-element-state.js";
import { initializeVideoElement } from "./html-video-element-state.js";

export function HTMLVideoElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLVideoElement, "HTMLVideoElement");

export function createHTMLVideoElement(tagName, ownerDocument, source = "") {
  const element = Object.create(HTMLVideoElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeMediaElement(element, source);
  initializeVideoElement(element);
  return element;
}

export function installHTMLVideoElementConstructor() {
  Object.setPrototypeOf(HTMLVideoElement.prototype, HTMLMediaElement.prototype);
  Object.setPrototypeOf(HTMLVideoElement, HTMLMediaElement);
  delete HTMLVideoElement.prototype.constructor;
  defineGlobalConstructor("HTMLVideoElement", HTMLVideoElement);
  registerHTMLElementFactory("video", createHTMLVideoElement);
}
