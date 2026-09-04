import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeAccessor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import {
  getAttributeValue,
  requireElement,
  setAttributeValue,
} from "./element-state.js";
import {
  HTMLHeadingElement,
} from "./html-heading-element-constructor.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get align() {
    requireElement(this);
    const result = getAttributeValue(this, "align") ?? "";
    traceGetter(
      "window.HTMLHeadingElement.prototype.align",
      "HTMLHeadingElement",
      result,
    );
    return result;
  },
  set align(value) {
    requireElement(this);
    setAttributeValue(this, "align", `${value}`);
  },
}, "align");

export const align = descriptor.get;
export const setAlign = descriptor.set;
registerNativeGetter(align, "align");
registerNativeFunction(setAlign, "set align");

export function installHTMLHeadingElementAlign() {
  definePrototypeAccessor(
    HTMLHeadingElement.prototype,
    "align",
    align,
    setAlign,
  );
}
