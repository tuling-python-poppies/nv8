import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { HTMLElement, registerHTMLElementFactory } from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeTrackElement } from "./html-track-element-state.js";

export function HTMLTrackElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLTrackElement, "HTMLTrackElement");

function createHTMLTrackElement(tagName, ownerDocument) {
  const element = Object.create(HTMLTrackElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeTrackElement(element);
  return element;
}

export function installHTMLTrackElementConstructor() {
  Object.setPrototypeOf(HTMLTrackElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLTrackElement, HTMLElement);
  delete HTMLTrackElement.prototype.constructor;
  defineGlobalConstructor("HTMLTrackElement", HTMLTrackElement);
  registerHTMLElementFactory("track", createHTMLTrackElement);
}
