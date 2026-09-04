import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElementInternals } from "./element-internals-state.js";

export function elementInternalsReadonlyDescriptor(name, read) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = read(requireElementInternals(this));
      traceGetter(`window.ElementInternals.prototype.${name}`, "ElementInternals", result);
      return result;
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  return descriptor;
}

export function elementInternalsARIAProperty(name, elements = false) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const record = requireElementInternals(this);
      const result = record.aria.get(name) ?? (elements ? null : null);
      traceGetter(`window.ElementInternals.prototype.${name}`, "ElementInternals", result);
      return result;
    },
    set [name](value) {
      const record = requireElementInternals(this);
      if (elements) {
        if (name === "ariaActiveDescendantElement") {
          record.aria.set(name, value ?? null);
        } else {
          record.aria.set(name, value == null ? null : [...value]);
        }
      } else {
        record.aria.set(name, value == null ? null : `${value}`);
      }
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}
