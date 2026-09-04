import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import {
  scriptTextValue,
  setScriptTextValue,
} from "./html-script-element-text-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get text() {
    const result = scriptTextValue(this);
    traceGetter(
      "window.HTMLScriptElement.prototype.text",
      "HTMLScriptElement",
      result,
    );
    return result;
  },
  set text(value) {
    setScriptTextValue(this, value);
  },
}, "text");

export const text = descriptor.get;
export const setText = descriptor.set;
registerNativeGetter(text, "text");
registerNativeFunction(setText, "set text");
