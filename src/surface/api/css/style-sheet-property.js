import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireStyleSheet } from "./style-sheet-state.js";

export function styleSheetReadonlyDescriptor(name, read) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = read(requireStyleSheet(this));
      traceGetter(`window.StyleSheet.prototype.${name}`, "StyleSheet", result);
      return result;
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  return descriptor;
}

export function styleSheetAccessorDescriptor(name, read, write) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = read(requireStyleSheet(this));
      traceGetter(`window.StyleSheet.prototype.${name}`, "StyleSheet", result);
      return result;
    },
    set [name](value) {
      write(requireStyleSheet(this), value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}
