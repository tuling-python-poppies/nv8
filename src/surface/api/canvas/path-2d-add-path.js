import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { isPath2D, requirePath2D } from "./path-2d-state.js";
export const addPath = {
  addPath(path) {
    if (!isPath2D(path)) throw new TypeError("addPath requires a Path2D");
    requirePath2D(this).push(...requirePath2D(path).map(command => [...command]));
    traceCall("window.Path2D.prototype.addPath", "Path2D", [path], undefined);
  },
}.addPath;
registerNativeFunction(addPath, "addPath");
