import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTextArea } from "./html-text-area-element-state.js";
export const type = Object.getOwnPropertyDescriptor({ get type() {
  requireTextArea(this);
  const result = "textarea";
  traceGetter("window.HTMLTextAreaElement.prototype.type", "HTMLTextAreaElement", result);
  return result;
}}, "type").get;
registerNativeGetter(type, "type");
