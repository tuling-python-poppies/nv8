import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireObjectElement } from "./html-object-element-state.js";
export const validationMessage = Object.getOwnPropertyDescriptor({
  get validationMessage() {
    requireObjectElement(this);
    const result = "";
    traceGetter("window.HTMLObjectElement.prototype.validationMessage", "HTMLObjectElement", result);
    return result;
  },
}, "validationMessage").get;
registerNativeGetter(validationMessage, "validationMessage");
