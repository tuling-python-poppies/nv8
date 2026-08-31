import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireMediaList } from "./media-list-state.js";

export function mediaListReadonlyDescriptor(name, read) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = read(requireMediaList(this));
      traceGetter(`window.MediaList.prototype.${name}`, "MediaList", result);
      return result;
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  return descriptor;
}

export function mediaListAccessorDescriptor(name, read, write) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = read(requireMediaList(this));
      traceGetter(`window.MediaList.prototype.${name}`, "MediaList", result);
      return result;
    },
    set [name](value) {
      requireMediaList(this);
      write(this, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}
