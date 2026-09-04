import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireFileList } from "./file-list-state.js";
export const values = { values() {
  const result = requireFileList(this).files[Symbol.iterator]();
  traceCall("window.FileList.prototype.values", "FileList", [], result);
  return result;
}}.values;
registerNativeFunction(values, "values");
