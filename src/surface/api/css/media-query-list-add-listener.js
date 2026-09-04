import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireMediaQueryList } from "./media-query-list-state.js";
export function addListener(callback) {
  requireMediaQueryList(this);
  if (typeof callback === "function") this.addEventListener("change", callback);
  traceCall("window.MediaQueryList.prototype.addListener", "MediaQueryList", [callback], undefined);
}
registerNativeFunction(addListener, "addListener");
