import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTemplate } from "./html-template-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get htmlFor() {
    const result = requireTemplate(this).htmlFor;
    traceGetter("window.HTMLTemplateElement.prototype.htmlFor", "HTMLTemplateElement", result);
    return result;
  },
  set htmlFor(value) {
    requireTemplate(this).htmlFor = `${value}`;
  },
}, "htmlFor");
export const htmlFor = descriptor.get;
export const setHtmlFor = descriptor.set;
registerNativeGetter(htmlFor, "htmlFor");
registerNativeFunction(setHtmlFor, "set htmlFor");
