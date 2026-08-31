import { traceCall } from "../../trace/trace-function.js";
import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLImageElement,
  createHTMLImageElement,
} from "./html-image-element-constructor.js";

export function Image() {
  const image = createHTMLImageElement("img", globalThis.document);
  if (arguments.length > 0 && arguments[0] !== undefined) {
    image.width = arguments[0];
  }
  if (arguments.length > 1 && arguments[1] !== undefined) {
    image.height = arguments[1];
  }
  traceCall("window.Image", "Window", [...arguments], image);
  return image;
}
registerNativeFunction(Image, "Image");

export function installImageConstructor() {
  Object.defineProperty(Image, "prototype", {
    value: HTMLImageElement.prototype,
    writable: false,
    enumerable: false,
    configurable: false,
  });
  defineGlobalConstructor("Image", Image);
}
