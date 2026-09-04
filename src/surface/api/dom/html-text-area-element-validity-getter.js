import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTextArea } from "./html-text-area-element-state.js";
export const validity = Object.getOwnPropertyDescriptor({ get validity() {
  const result = requireTextArea(this).validity;
  traceGetter("window.HTMLTextAreaElement.prototype.validity", "HTMLTextAreaElement", result);
  return result;
}}, "validity").get;
registerNativeGetter(validity, "validity");
