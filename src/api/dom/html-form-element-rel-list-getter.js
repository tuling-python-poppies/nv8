import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireForm } from "./html-form-element-state.js";

export const relList = Object.getOwnPropertyDescriptor({
  get relList() {
    const result = requireForm(this).relList;
    traceGetter("window.HTMLFormElement.prototype.relList", "HTMLFormElement", result);
    return result;
  },
}, "relList").get;
registerNativeGetter(relList, "relList");
