import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireButton } from "./html-button-element-state.js";
export const validity = Object.getOwnPropertyDescriptor({ get validity() {
  const result = requireButton(this).validity;
  traceGetter("window.HTMLButtonElement.prototype.validity", "HTMLButtonElement", result);
  return result;
}}, "validity").get;
registerNativeGetter(validity, "validity");
