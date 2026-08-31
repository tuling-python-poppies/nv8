import { traceGetter } from "../../trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import {
  scriptTextValue,
  setScriptTextValue,
} from "./html-script-element-text-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get textContent() {
    const result = scriptTextValue(this);
    traceGetter(
      "window.HTMLScriptElement.prototype.textContent",
      "HTMLScriptElement",
      result,
    );
    return result;
  },
  set textContent(value) {
    setScriptTextValue(this, value, true);
  },
}, "textContent");

export const textContent = descriptor.get;
export const setTextContent = descriptor.set;
registerNativeGetter(textContent, "textContent");
registerNativeFunction(setTextContent, "set textContent");
