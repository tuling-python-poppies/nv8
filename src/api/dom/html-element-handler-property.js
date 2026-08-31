import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { htmlHandler, setHTMLHandler } from "./html-element-state.js";

export function htmlElementHandlerDescriptor(name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = htmlHandler(this, name);
      traceGetter(`window.HTMLElement.prototype.${name}`, "HTMLElement", result);
      return result;
    },
    set [name](value) {
      setHTMLHandler(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}
