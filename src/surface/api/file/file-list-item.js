import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireFileList } from "./file-list-state.js";
export const item = { item(index) {
  const result = requireFileList(this).files[Number(index) >>> 0] ?? null;
  traceCall("window.FileList.prototype.item", "FileList", [index], result);
  return result;
}}.item;
registerNativeFunction(item, "item");
