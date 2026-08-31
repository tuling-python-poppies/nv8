import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeAccessor } from "../../webidl/descriptor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { HTMLElement } from "./html-element-constructor.js";
import {
  getAttributeValue,
  requireElement,
  setAttributeValue,
} from "./element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get slot() {
    requireElement(this);
    const result = getAttributeValue(this, "slot") ?? "";
    traceGetter("window.HTMLElement.prototype.slot", "HTMLElement", result);
    return result;
  },
  set slot(value) {
    requireElement(this);
    setAttributeValue(this, "slot", `${value}`);
  },
}, "slot");

export const slot = descriptor.get;
export const setSlot = descriptor.set;
registerNativeGetter(slot, "slot");
registerNativeFunction(setSlot, "set slot");

export function installHTMLElementSlot() {
  definePrototypeAccessor(HTMLElement.prototype, "slot", slot, setSlot);
}
