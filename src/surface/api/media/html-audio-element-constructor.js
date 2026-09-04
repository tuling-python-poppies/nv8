import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  registerHTMLElementFactory,
} from "../dom/html-element-constructor.js";
import {
  HTML_NAMESPACE,
  initializeElement,
} from "../dom/element-state.js";
import { HTMLMediaElement } from "./html-media-element-constructor.js";
import { initializeMediaElement } from "./html-media-element-state.js";

export function HTMLAudioElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLAudioElement, "HTMLAudioElement");

export function createHTMLAudioElement(tagName, ownerDocument, source = "") {
  const element = Object.create(HTMLAudioElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeMediaElement(element, source);
  return element;
}

export function installHTMLAudioElementConstructor() {
  Object.setPrototypeOf(HTMLAudioElement.prototype, HTMLMediaElement.prototype);
  Object.setPrototypeOf(HTMLAudioElement, HTMLMediaElement);
  delete HTMLAudioElement.prototype.constructor;
  defineGlobalConstructor("HTMLAudioElement", HTMLAudioElement);
  registerHTMLElementFactory("audio", createHTMLAudioElement);
}

export function finishHTMLAudioElementConstructor() {
  defineConstructorBacklink(HTMLAudioElement.prototype, HTMLAudioElement);
  defineToStringTag(HTMLAudioElement.prototype, "HTMLAudioElement");
}
