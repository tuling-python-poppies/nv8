import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireTextArea } from "./html-text-area-element-state.js";
export const type = Object.getOwnPropertyDescriptor({ get type() {
  requireTextArea(this);
  const result = "textarea";
  traceGetter("window.HTMLTextAreaElement.prototype.type", "HTMLTextAreaElement", result);
  return result;
}}, "type").get;
registerNativeGetter(type, "type");
