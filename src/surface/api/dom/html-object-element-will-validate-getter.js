import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireObjectElement } from "./html-object-element-state.js";
export const willValidate = Object.getOwnPropertyDescriptor({ get willValidate() {
  requireObjectElement(this);
  const result = false;
  traceGetter("window.HTMLObjectElement.prototype.willValidate", "HTMLObjectElement", result);
  return result;
}}, "willValidate").get;
registerNativeGetter(willValidate, "willValidate");
