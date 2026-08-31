import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { HTMLElement, registerHTMLElementFactory } from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeFencedFrameElement } from "./html-fenced-frame-element-state.js";

export function HTMLFencedFrameElement() {
  throw new TypeError(
    "Failed to construct 'HTMLFencedFrameElement': Illegal constructor",
  );
}
registerNativeFunction(HTMLFencedFrameElement, "HTMLFencedFrameElement");

function createHTMLFencedFrameElement(tagName, ownerDocument) {
  const element = Object.create(HTMLFencedFrameElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeFencedFrameElement(element);
  return element;
}

export function installHTMLFencedFrameElementConstructor() {
  Object.setPrototypeOf(HTMLFencedFrameElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLFencedFrameElement, HTMLElement);
  delete HTMLFencedFrameElement.prototype.constructor;
  defineGlobalConstructor("HTMLFencedFrameElement", HTMLFencedFrameElement);
  registerHTMLElementFactory("fencedframe", createHTMLFencedFrameElement);
}
