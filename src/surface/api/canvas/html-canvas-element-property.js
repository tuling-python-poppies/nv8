import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import {
  htmlCanvasDimension,
  requireHTMLCanvasElement,
  setHTMLCanvasDimension,
} from "./html-canvas-element-state.js";

export function htmlCanvasDimensionProperty(name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      requireHTMLCanvasElement(this);
      const result = htmlCanvasDimension(this, name);
      traceGetter(
        `window.HTMLCanvasElement.prototype.${name}`,
        "HTMLCanvasElement",
        result,
      );
      return result;
    },
    set [name](value) {
      requireHTMLCanvasElement(this);
      setHTMLCanvasDimension(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}
