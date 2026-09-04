import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireObjectElement } from "./html-object-element-state.js";
export const validity = Object.getOwnPropertyDescriptor({ get validity() {
  const result = requireObjectElement(this).validity;
  traceGetter("window.HTMLObjectElement.prototype.validity", "HTMLObjectElement", result);
  return result;
}}, "validity").get;
registerNativeGetter(validity, "validity");
