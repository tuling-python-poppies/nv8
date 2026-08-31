import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeAccessor } from "../../webidl/descriptor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import {
  getAttributeValue,
  requireElement,
  setAttributeValue,
} from "./element-state.js";
import { HTMLPreElement } from "./html-pre-element-constructor.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get width() {
    requireElement(this);
    const parsed = Number.parseInt(
      getAttributeValue(this, "width") ?? "",
      10,
    );
    const result = Number.isFinite(parsed) && parsed >= 0 ? parsed >>> 0 : 0;
    traceGetter(
      "window.HTMLPreElement.prototype.width",
      "HTMLPreElement",
      result,
    );
    return result;
  },
  set width(value) {
    requireElement(this);
    setAttributeValue(this, "width", `${Number(value) >>> 0}`);
  },
}, "width");

export const width = descriptor.get;
export const setWidth = descriptor.set;
registerNativeGetter(width, "width");
registerNativeFunction(setWidth, "set width");

export function installHTMLPreElementWidth() {
  definePrototypeAccessor(
    HTMLPreElement.prototype,
    "width",
    width,
    setWidth,
  );
}
