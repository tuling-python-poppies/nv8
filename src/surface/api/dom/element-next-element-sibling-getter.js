import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { nextElementSiblingOperation } from "./element-extended-operations.js";
export const nextElementSibling = Object.getOwnPropertyDescriptor({ get nextElementSibling() {
  requireElement(this); const result = nextElementSiblingOperation(this);
  traceGetter("window.Element.prototype.nextElementSibling", "Element", result); return result;
}}, "nextElementSibling").get;
registerNativeGetter(nextElementSibling, "nextElementSibling");
