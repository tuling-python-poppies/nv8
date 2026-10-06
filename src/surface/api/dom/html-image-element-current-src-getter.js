import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { src } from "./url-reflection-html-image-element-members.js";

export const currentSrc = Object.getOwnPropertyDescriptor({
  get currentSrc() {
    const result = Reflect.apply(src, this, []);
    traceGetter("window.HTMLImageElement.prototype.currentSrc", "HTMLImageElement", result);
    return result;
  },
}, "currentSrc").get;
registerNativeGetter(currentSrc, "currentSrc");
