import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireUserMediaElement } from "./html-user-media-element-state.js";

function accessor(name) {
  const holder = {};
  Object.defineProperty(holder, name, {
    get() {
      const value = requireUserMediaElement(this)[name];
      traceGetter(`window.HTMLUserMediaElement.prototype.${name}`, "HTMLUserMediaElement", value);
      return value;
    },
    set(value) {
      requireUserMediaElement(this)[name] = typeof value === "function" ? value : null;
    },
  });
  return Object.getOwnPropertyDescriptor(holder, name);
}

const oncancelDescriptor = accessor("oncancel");
const onerrorDescriptor = accessor("onerror");
const onstreamDescriptor = accessor("onstream");
export const oncancel = oncancelDescriptor.get;
export const setOncancel = oncancelDescriptor.set;
export const onerror = onerrorDescriptor.get;
export const setOnerror = onerrorDescriptor.set;
export const onstream = onstreamDescriptor.get;
export const setOnstream = onstreamDescriptor.set;
registerNativeGetter(oncancel, "oncancel");
registerNativeFunction(setOncancel, "set oncancel");
registerNativeGetter(onerror, "onerror");
registerNativeFunction(setOnerror, "set onerror");
registerNativeGetter(onstream, "onstream");
registerNativeFunction(setOnstream, "set onstream");

export const error = Object.getOwnPropertyDescriptor({
  get error() {
    const value = requireUserMediaElement(this).error;
    traceGetter("window.HTMLUserMediaElement.prototype.error", "HTMLUserMediaElement", value);
    return value;
  },
}, "error").get;
registerNativeGetter(error, "error");

export const stream = Object.getOwnPropertyDescriptor({
  get stream() {
    const value = requireUserMediaElement(this).stream;
    traceGetter("window.HTMLUserMediaElement.prototype.stream", "HTMLUserMediaElement", value);
    return value;
  },
}, "stream").get;
registerNativeGetter(stream, "stream");

export function setConstraints() {
  requireUserMediaElement(this);
  return undefined;
}
registerNativeFunction(setConstraints, "setConstraints");
