import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { selectionValue } from "./selection-state.js";
export const isCollapsed = Object.getOwnPropertyDescriptor({ get isCollapsed() {
  const value = selectionValue(this, "isCollapsed");
  traceGetter("window.Selection.prototype.isCollapsed", "Selection", value);
  return value;
}}, "isCollapsed").get;
registerNativeGetter(isCollapsed, "isCollapsed");
