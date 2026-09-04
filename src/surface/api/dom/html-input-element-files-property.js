import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { createFileList, requireFileList } from "../file/file-list-state.js";
import { normalizedInputType, requireInput } from "./html-input-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get files() {
    const state = requireInput(this);
    const result = normalizedInputType(this) === "file" ? state.files : null;
    traceGetter("window.HTMLInputElement.prototype.files", "HTMLInputElement", result);
    return result;
  },
  set files(value) {
    const state = requireInput(this);
    if (value === null) {
      state.files = createFileList();
      return;
    }
    requireFileList(value);
    state.files = value;
  },
}, "files");
export const files = descriptor.get;
export const setFiles = descriptor.set;
registerNativeGetter(files, "files");
registerNativeFunction(setFiles, "set files");
