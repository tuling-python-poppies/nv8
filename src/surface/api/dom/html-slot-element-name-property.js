import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeAccessor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { HTMLSlotElement } from "./html-slot-element-constructor.js";
import {
  getAttributeValue,
  requireElement,
  setAttributeValue,
} from "./element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get name() {
    requireElement(this);
    const result = getAttributeValue(this, "name") ?? "";
    traceGetter(
      "window.HTMLSlotElement.prototype.name",
      "HTMLSlotElement",
      result,
    );
    return result;
  },
  set name(value) {
    requireElement(this);
    setAttributeValue(this, "name", `${value}`);
  },
}, "name");

export const name = descriptor.get;
export const setName = descriptor.set;
registerNativeGetter(name, "name");
registerNativeFunction(setName, "set name");

export function installHTMLSlotElementName() {
  definePrototypeAccessor(HTMLSlotElement.prototype, "name", name, setName);
}
