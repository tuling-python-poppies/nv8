import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import {
  inputValidityFlags,
  inputWillValidate,
  requireInput,
} from "./html-input-element-state.js";
export const validationMessage = Object.getOwnPropertyDescriptor({
  get validationMessage() {
    const state = requireInput(this);
    const flags = inputValidityFlags(this);
    const result = !inputWillValidate(this) ? ""
      : state.customValidity !== "" ? state.customValidity
        : flags.valueMissing ? "Please fill out this field."
          : flags.typeMismatch ? "Please enter a valid value."
            : flags.patternMismatch ? "Please match the requested format."
              : flags.tooLong ? "Please shorten this text."
                : flags.tooShort ? "Please lengthen this text."
                  : flags.rangeUnderflow ? "Value must be greater than or equal to the minimum."
                    : flags.rangeOverflow ? "Value must be less than or equal to the maximum."
                      : flags.stepMismatch ? "Please enter a valid value." : "";
    traceGetter("window.HTMLInputElement.prototype.validationMessage", "HTMLInputElement", result);
    return result;
  },
}, "validationMessage").get;
registerNativeGetter(validationMessage, "validationMessage");
