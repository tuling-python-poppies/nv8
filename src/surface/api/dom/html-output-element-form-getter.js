import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { formOwnerOf } from "./form-association.js";
import { requireOutput } from "./html-output-element-state.js";

export const form = Object.getOwnPropertyDescriptor({
  get form() {
    requireOutput(this);
    const result = formOwnerOf(this);
    traceGetter("window.HTMLOutputElement.prototype.form", "HTMLOutputElement", result);
    return result;
  },
}, "form").get;
registerNativeGetter(form, "form");
