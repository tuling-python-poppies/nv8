import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { URL } from "./url-constructor.js";
import { canParseURL } from "./url-state.js";

export const canParse = {
  canParse(url) {
    if (arguments.length === 0) {
      throw new TypeError("URL.canParse requires 1 argument");
    }
    const value = canParseURL(url, arguments[1]);
    traceCall("window.URL.canParse", "URL", Array.from(arguments), value);
    return value;
  },
}.canParse;
registerNativeFunction(canParse, "canParse");
export function installURLCanParse() {
  definePrototypeMethod(URL, "canParse", canParse);
}
