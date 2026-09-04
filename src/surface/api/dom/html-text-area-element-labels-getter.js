import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTextArea } from "./html-text-area-element-state.js";
export const labels = Object.getOwnPropertyDescriptor({ get labels() {
  const result = requireTextArea(this).labels;
  traceGetter("window.HTMLTextAreaElement.prototype.labels", "HTMLTextAreaElement", result);
  return result;
}}, "labels").get;
registerNativeGetter(labels, "labels");
