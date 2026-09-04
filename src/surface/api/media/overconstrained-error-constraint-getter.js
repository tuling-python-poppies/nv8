import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireOverconstrainedError } from "./overconstrained-error-state.js";
export const constraint = Object.getOwnPropertyDescriptor({ get constraint() {
  const result = requireOverconstrainedError(this);
  traceGetter("window.OverconstrainedError.prototype.constraint", "OverconstrainedError", result);
  return result;
}}, "constraint").get;
registerNativeGetter(constraint, "constraint");
