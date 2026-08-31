import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireButton } from "./html-button-element-state.js";
export const labels = Object.getOwnPropertyDescriptor({ get labels() {
  const result = requireButton(this).labels;
  traceGetter("window.HTMLButtonElement.prototype.labels", "HTMLButtonElement", result);
  return result;
}}, "labels").get;
registerNativeGetter(labels, "labels");
