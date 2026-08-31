import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get text() {
    requireElement(this);
    const result = this.textContent.trim().replace(/\s+/gu, " ");
    traceGetter("window.HTMLOptionElement.prototype.text", "HTMLOptionElement", result);
    return result;
  },
  set text(value) {
    requireElement(this);
    this.textContent = `${value}`;
  },
}, "text");
export const text = descriptor.get;
export const setText = descriptor.set;
registerNativeGetter(text, "text");
registerNativeFunction(setText, "set text");
