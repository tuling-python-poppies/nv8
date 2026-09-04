import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import {
  inputNumericValue,
  normalizedInputType,
  requireInput,
  setInputValue,
} from "./html-input-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get valueAsDate() {
    requireInput(this);
    const number = inputNumericValue(this);
    const result = normalizedInputType(this) === "date" && Number.isFinite(number)
      ? new Date(number) : null;
    traceGetter("window.HTMLInputElement.prototype.valueAsDate", "HTMLInputElement", result);
    return result;
  },
  set valueAsDate(value) {
    requireInput(this);
    if (normalizedInputType(this) !== "date") {
      throw new DOMException("valueAsDate is not applicable to this input type", "InvalidStateError");
    }
    if (value === null) {
      setInputValue(this, "");
      return;
    }
    if (!(value instanceof Date)) throw new TypeError("valueAsDate must be a Date or null");
    if (!Number.isFinite(value.getTime())) {
      setInputValue(this, "");
      return;
    }
    setInputValue(this, value.toISOString().slice(0, 10));
  },
}, "valueAsDate");
export const valueAsDate = descriptor.get;
export const setValueAsDate = descriptor.set;
registerNativeGetter(valueAsDate, "valueAsDate");
registerNativeFunction(setValueAsDate, "set valueAsDate");
