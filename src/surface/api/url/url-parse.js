import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { URL } from "./url-constructor.js";
import { canParseURL, createURL } from "./url-state.js";

export const parse = {
  parse(url) {
    if (arguments.length === 0) {
      throw new TypeError("URL.parse requires 1 argument");
    }
    const base = arguments[1];
    const value = canParseURL(url, base) ? createURL(url, base) : null;
    traceCall("window.URL.parse", "URL", Array.from(arguments), value);
    return value;
  },
}.parse;
registerNativeFunction(parse, "parse");
export function installURLParse() {
  definePrototypeMethod(URL, "parse", parse);
}
