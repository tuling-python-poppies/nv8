import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireFileList } from "./file-list-state.js";
export const length = Object.getOwnPropertyDescriptor({ get length() {
  const result = requireFileList(this).files.length;
  traceGetter("window.FileList.prototype.length", "FileList", result);
  return result;
}}, "length").get;
registerNativeGetter(length, "length");
