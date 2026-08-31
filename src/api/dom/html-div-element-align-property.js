import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeAccessor } from "../../webidl/descriptor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import {
  getAttributeValue,
  requireElement,
  setAttributeValue,
} from "./element-state.js";
import { HTMLDivElement } from "./html-div-element-constructor.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get align() {
    requireElement(this);
    const result = getAttributeValue(this, "align") ?? "";
    traceGetter(
      "window.HTMLDivElement.prototype.align",
      "HTMLDivElement",
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

export function installHTMLDivElementAlign() {
  definePrototypeAccessor(
    HTMLDivElement.prototype,
    "align",
    align,
    setAlign,
  );
}
