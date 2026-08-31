import { traceGetter } from "../../trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import {
  requireOffscreenCanvas,
  resizeOffscreenCanvas,
} from "./offscreen-canvas-state.js";

export function offscreenCanvasProperty(name, select, assign) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = select(requireOffscreenCanvas(this));
      traceGetter(`window.OffscreenCanvas.prototype.${name}`, "OffscreenCanvas", result);
      return result;
    },
    set [name](value) {
      requireOffscreenCanvas(this);
      assign(this, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}

export function dimensionProperty(name) {
  return offscreenCanvasProperty(
    name,
    state => state[name],
    (canvas, value) => resizeOffscreenCanvas(canvas, name, value),
  );
}
