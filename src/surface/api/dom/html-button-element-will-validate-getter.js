import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { buttonWillValidate } from "./html-button-element-state.js";
export const willValidate = Object.getOwnPropertyDescriptor({ get willValidate() {
  const result = buttonWillValidate(this);
  traceGetter("window.HTMLButtonElement.prototype.willValidate", "HTMLButtonElement", result);
  return result;
}}, "willValidate").get;
registerNativeGetter(willValidate, "willValidate");
