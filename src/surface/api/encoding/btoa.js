import { traceCall } from "../../../infra/trace/trace-function.js";
import { defineGlobalFunction } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export const btoa = {
  btoa(data) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'btoa': 1 argument required.");
    }
    const input = `${data}`;
    const bytes = [];
    for (let index = 0; index < input.length; index += 1) {
      const unit = input.charCodeAt(index);
      if (unit > 0xff) {
        throw new DOMException(
          "The string to be encoded contains characters outside of the Latin1 range.",
          "InvalidCharacterError",
        );
      }
      bytes.push(unit);
    }
    let output = "";
    for (let index = 0; index < bytes.length; index += 3) {
      const first = bytes[index];
      const second = bytes[index + 1];
      const third = bytes[index + 2];
      const combined = (first << 16)
        | ((second ?? 0) << 8)
        | (third ?? 0);
      output += alphabet[(combined >> 18) & 63];
      output += alphabet[(combined >> 12) & 63];
      output += second === undefined ? "=" : alphabet[(combined >> 6) & 63];
      output += third === undefined ? "=" : alphabet[combined & 63];
    }
    traceCall("window.btoa", "Window", [input], output);
    return output;
  },
}.btoa;

registerNativeFunction(btoa, "btoa");

export function installBtoa() {
  defineGlobalFunction("btoa", btoa);
}
