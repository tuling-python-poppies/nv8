import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireTextArea } from "./html-text-area-element-state.js";
export const textLength = Object.getOwnPropertyDescriptor({ get textLength() {
  const result = requireTextArea(this).value.length;
  traceGetter("window.HTMLTextAreaElement.prototype.textLength", "HTMLTextAreaElement", result);
  return result;
}}, "textLength").get;
registerNativeGetter(textLength, "textLength");
