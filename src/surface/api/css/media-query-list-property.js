import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireMediaQueryList } from "./media-query-list-state.js";

export function mediaQueryListReadonlyDescriptor(name, read) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = read(requireMediaQueryList(this));
      traceGetter(`window.MediaQueryList.prototype.${name}`, "MediaQueryList", result);
      return result;
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  return descriptor;
}

export function mediaQueryListAccessorDescriptor(name, read, write) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = read(requireMediaQueryList(this));
      traceGetter(`window.MediaQueryList.prototype.${name}`, "MediaQueryList", result);
      return result;
    },
    set [name](value) {
      write(requireMediaQueryList(this), value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}
