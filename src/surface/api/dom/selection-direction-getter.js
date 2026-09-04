import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { selectionValue } from "./selection-state.js";
export const direction = Object.getOwnPropertyDescriptor({ get direction() {
  const value = selectionValue(this, "direction");
  traceGetter("window.Selection.prototype.direction", "Selection", value);
  return value;
}}, "direction").get;
registerNativeGetter(direction, "direction");
