import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";

export function cssStyleReadonlyDescriptor(name, read) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = read(this);
      traceGetter(`window.CSSStyleDeclaration.prototype.${name}`, "CSSStyleDeclaration", result);
      return result;
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  return descriptor;
}

export function cssStyleAccessorDescriptor(name, read, write) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = read(this);
      traceGetter(`window.CSSStyleDeclaration.prototype.${name}`, "CSSStyleDeclaration", result);
      return result;
    },
    set [name](value) {
      write(this, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}
