import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { urlReflection } from "./html-reflection.js";

// 复用 src 的 getter。表里 src 在多接口上重名，按名字查会串到别的接口，
// 所以这里把参数写全（与 url-reflection-members.js 的对应行一致）。
const src = urlReflection("HTMLImageElement", "src", "src").get;
export const currentSrc = Object.getOwnPropertyDescriptor({
  get currentSrc() {
    const result = Reflect.apply(src, this, []);
    traceGetter("window.HTMLImageElement.prototype.currentSrc", "HTMLImageElement", result);
    return result;
  },
}, "currentSrc").get;
registerNativeGetter(currentSrc, "currentSrc");
