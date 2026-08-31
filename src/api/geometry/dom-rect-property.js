import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import {
  findCrossRealmPrototypeAccessor,
} from "../../webidl/cross-realm-method.js";
import { requireDOMRect } from "./dom-rect-state.js";

export function rectGetter(name, select = state => state[name]) {
  const getter = Object.getOwnPropertyDescriptor({ get [name]() {
    const foreignGetter = findCrossRealmPrototypeAccessor(
      this,
      name,
      "get",
      getter,
    );
    if (foreignGetter !== null) {
      return Reflect.apply(foreignGetter, this, []);
    }
    const result = select(requireDOMRect(this));
    traceGetter(`window.DOMRectReadOnly.prototype.${name}`, "DOMRectReadOnly", result);
    return result;
  }}, name).get;
  registerNativeGetter(getter, name);
  return getter;
}

export function mutableRectProperty(name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const foreignGetter = findCrossRealmPrototypeAccessor(
        this,
        name,
        "get",
        descriptor.get,
      );
      if (foreignGetter !== null) {
        return Reflect.apply(foreignGetter, this, []);
      }
      return requireDOMRect(this)[name];
    },
    set [name](value) {
      const foreignSetter = findCrossRealmPrototypeAccessor(
        this,
        name,
        "set",
        descriptor.set,
      );
      if (foreignSetter !== null) {
        return Reflect.apply(foreignSetter, this, [value]);
      }
      requireDOMRect(this)[name] = Number(value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}
