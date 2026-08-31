import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { src } from "./html-image-element-src-property.js";
export const currentSrc = Object.getOwnPropertyDescriptor({
  get currentSrc() {
    const result = Reflect.apply(src, this, []);
    traceGetter("window.HTMLImageElement.prototype.currentSrc", "HTMLImageElement", result);
    return result;
  },
}, "currentSrc").get;
registerNativeGetter(currentSrc, "currentSrc");
