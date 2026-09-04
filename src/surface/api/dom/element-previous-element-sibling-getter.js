import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { previousElementSiblingOperation } from "./element-extended-operations.js";
export const previousElementSibling = Object.getOwnPropertyDescriptor({ get previousElementSibling() {
  requireElement(this); const result = previousElementSiblingOperation(this);
  traceGetter("window.Element.prototype.previousElementSibling", "Element", result); return result;
}}, "previousElementSibling").get;
registerNativeGetter(previousElementSibling, "previousElementSibling");
