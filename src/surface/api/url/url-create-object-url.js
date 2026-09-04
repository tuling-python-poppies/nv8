import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { URL } from "./url-constructor.js";
import { createObjectURL as create } from "./url-state.js";

export const createObjectURL = {
  createObjectURL(object) {
    if (arguments.length === 0) {
      throw new TypeError("URL.createObjectURL requires a Blob or MediaSource");
    }
    const value = create(object);
    traceCall("window.URL.createObjectURL", "URL", [object], value);
    return value;
  },
}.createObjectURL;
registerNativeFunction(createObjectURL, "createObjectURL");
export function installURLCreateObjectURL() {
  definePrototypeMethod(URL, "createObjectURL", createObjectURL);
}
