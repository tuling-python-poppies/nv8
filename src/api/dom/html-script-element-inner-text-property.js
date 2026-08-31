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
  get innerText() {
    const result = scriptTextValue(this);
    traceGetter(
      "window.HTMLScriptElement.prototype.innerText",
      "HTMLScriptElement",
      result,
    );
    return result;
  },
  set innerText(value) {
    setScriptTextValue(this, value);
  },
}, "innerText");

export const innerText = descriptor.get;
export const setInnerText = descriptor.set;
registerNativeGetter(innerText, "innerText");
registerNativeFunction(setInnerText, "set innerText");
