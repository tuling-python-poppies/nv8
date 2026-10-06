import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { urlReflection } from "./html-reflection.js";

// 复用 href 的 getter。表里 href 在多接口上重名，按名字查会串到别的接口，
// 所以这里把参数写全（与 url-reflection-members.js 的对应行一致）。
const href = urlReflection("HTMLAnchorElement", "href", "href").get;

export const toString = {
  toString() {
    const result = Reflect.apply(href, this, []);
    traceCall(
      "window.HTMLAnchorElement.prototype.toString",
      "HTMLAnchorElement",
      [],
      result,
    );
    return result;
  },
}.toString;
registerNativeFunction(toString, "toString");
