import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import {
  inputNumericValue,
  normalizedInputType,
  requireInput,
  setInputValue,
} from "./html-input-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get valueAsNumber() {
    requireInput(this);
    const result = inputNumericValue(this);
    traceGetter("window.HTMLInputElement.prototype.valueAsNumber", "HTMLInputElement", result);
    return result;
  },
  set valueAsNumber(value) {
    requireInput(this);
    const type = normalizedInputType(this);
    if (!["date", "number", "range"].includes(type)) {
      throw new DOMException("valueAsNumber is not applicable to this input type", "InvalidStateError");
    }
    const number = Number(value);
    if (!Number.isFinite(number)) {
      setInputValue(this, "");
      return;
    }
    if (type === "date") {
      setInputValue(this, new Date(number).toISOString().slice(0, 10));
    } else {
      setInputValue(this, `${number}`);
    }
  },
}, "valueAsNumber");
export const valueAsNumber = descriptor.get;
export const setValueAsNumber = descriptor.set;
registerNativeGetter(valueAsNumber, "valueAsNumber");
registerNativeFunction(setValueAsNumber, "set valueAsNumber");
