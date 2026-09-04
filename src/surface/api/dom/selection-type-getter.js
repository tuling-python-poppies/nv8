import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { selectionValue } from "./selection-state.js";
export const type = Object.getOwnPropertyDescriptor({ get type() {
  const value = selectionValue(this, "type");
  traceGetter("window.Selection.prototype.type", "Selection", value);
  return value;
}}, "type").get;
registerNativeGetter(type, "type");
