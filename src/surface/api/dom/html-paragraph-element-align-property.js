import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeAccessor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import {
  getAttributeValue,
  requireElement,
  setAttributeValue,
} from "./element-state.js";
import {
  HTMLParagraphElement,
} from "./html-paragraph-element-constructor.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get align() {
    requireElement(this);
    const result = getAttributeValue(this, "align") ?? "";
    traceGetter(
      "window.HTMLParagraphElement.prototype.align",
      "HTMLParagraphElement",
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

export function installHTMLParagraphElementAlign() {
  definePrototypeAccessor(
    HTMLParagraphElement.prototype,
    "align",
    align,
    setAlign,
  );
}
