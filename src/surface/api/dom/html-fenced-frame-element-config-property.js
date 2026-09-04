import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { isFencedFrameConfig } from "./fenced-frame-config-state.js";
import { requireFencedFrameElement } from "./html-fenced-frame-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get config() {
    const result = requireFencedFrameElement(this).config;
    traceGetter("window.HTMLFencedFrameElement.prototype.config", "HTMLFencedFrameElement", result);
    return result;
  },
  set config(value) {
    if (value !== null && !isFencedFrameConfig(value)) {
      throw new TypeError(
        "Failed to set 'config' on 'HTMLFencedFrameElement': value is not a FencedFrameConfig.",
      );
    }
    requireFencedFrameElement(this).config = value;
  },
}, "config");
export const config = descriptor.get;
export const setConfig = descriptor.set;
registerNativeGetter(config, "config");
registerNativeFunction(setConfig, "set config");
