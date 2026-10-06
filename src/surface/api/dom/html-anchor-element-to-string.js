import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { href } from "./html-anchor-element-href-property.js";

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
