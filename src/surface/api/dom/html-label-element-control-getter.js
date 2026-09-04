import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { labelControl } from "./form-association.js";

export const control = Object.getOwnPropertyDescriptor({
  get control() {
    requireElement(this);
    const result = labelControl(this);
    traceGetter(
      "window.HTMLLabelElement.prototype.control",
      "HTMLLabelElement",
      result,
    );
    return result;
  },
}, "control").get;
registerNativeGetter(control, "control");
