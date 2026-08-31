import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireTextArea, textAreaValidityFlags, textAreaWillValidate } from "./html-text-area-element-state.js";
export const validationMessage = Object.getOwnPropertyDescriptor({ get validationMessage() {
  const state = requireTextArea(this);
  const flags = textAreaValidityFlags(this);
  const result = !textAreaWillValidate(this) ? ""
    : state.customValidity !== "" ? state.customValidity
      : flags.valueMissing ? "Please fill out this field."
        : flags.tooLong ? "Please shorten this text."
          : flags.tooShort ? "Please lengthen this text." : "";
  traceGetter("window.HTMLTextAreaElement.prototype.validationMessage", "HTMLTextAreaElement", result);
  return result;
}}, "validationMessage").get;
registerNativeGetter(validationMessage, "validationMessage");
