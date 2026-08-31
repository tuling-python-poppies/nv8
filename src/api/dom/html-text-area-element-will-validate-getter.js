import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { textAreaWillValidate } from "./html-text-area-element-state.js";
export const willValidate = Object.getOwnPropertyDescriptor({ get willValidate() {
  const result = textAreaWillValidate(this);
  traceGetter("window.HTMLTextAreaElement.prototype.willValidate", "HTMLTextAreaElement", result);
  return result;
}}, "willValidate").get;
registerNativeGetter(willValidate, "willValidate");
