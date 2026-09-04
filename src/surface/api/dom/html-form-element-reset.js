import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { resetSelect } from "./html-select-element-state.js";
import { resetOutput } from "./html-output-element-state.js";
import { resetTextArea } from "./html-text-area-element-state.js";
import { resetInput } from "./html-input-element-state.js";
import {
  formControls,
  requireForm,
} from "./html-form-element-state.js";

export const reset = {
  reset() {
    const state = requireForm(this);
    const event = new Event("reset", {
      bubbles: true,
      cancelable: true,
    });
    if (this.dispatchEvent(event)) {
      for (const control of formControls(this)) {
        if (control.localName === "select") {
          resetSelect(control);
        } else if (control.localName === "output") {
          resetOutput(control);
        } else if (control.localName === "textarea") {
          resetTextArea(control);
        } else if (control.localName === "input") {
          resetInput(control);
        } else if ("defaultValue" in control) {
          control.value = control.defaultValue;
        }
        if ("defaultChecked" in control) {
          control.checked = control.defaultChecked;
        }
      }
      state.resetCount += 1;
    }
    traceCall("window.HTMLFormElement.prototype.reset", "HTMLFormElement", [], undefined);
  },
}.reset;
registerNativeFunction(reset, "reset");
