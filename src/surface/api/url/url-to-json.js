import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { URL } from "./url-constructor.js";
import { serializeURL } from "./url-state.js";

export const toJSON = {
  toJSON() {
    const value = serializeURL(this);
    traceCall("window.URL.prototype.toJSON", "URL", [], value);
    return value;
  },
}.toJSON;
registerNativeFunction(toJSON, "toJSON");
export function installURLToJSON() {
  definePrototypeMethod(URL.prototype, "toJSON", toJSON);
}
