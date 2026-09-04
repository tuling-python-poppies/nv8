import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireMediaQueryList } from "./media-query-list-state.js";
export function removeListener(callback) {
  requireMediaQueryList(this);
  if (typeof callback === "function") this.removeEventListener("change", callback);
  traceCall("window.MediaQueryList.prototype.removeListener", "MediaQueryList", [callback], undefined);
}
registerNativeFunction(removeListener, "removeListener");
