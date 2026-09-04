import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { isMediaStream } from "./media-stream-state.js";
import { requireMediaElement } from "./html-media-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get srcObject() {
    const result = requireMediaElement(this).srcObject;
    traceGetter("window.HTMLMediaElement.prototype.srcObject", "HTMLMediaElement", result);
    return result;
  },
  set srcObject(value) {
    if (value !== null && !isMediaStream(value)) {
      throw new TypeError("srcObject must be a MediaStream or null");
    }
    requireMediaElement(this).srcObject = value;
  },
}, "srcObject");
export const srcObject = descriptor.get;
export const setSrcObject = descriptor.set;
registerNativeGetter(srcObject, "srcObject");
registerNativeFunction(setSrcObject, "set srcObject");
