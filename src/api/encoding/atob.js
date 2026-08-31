import { traceCall } from "../../trace/trace-function.js";
import { defineGlobalFunction } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export const atob = {
  atob(data) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'atob': 1 argument required.");
    }
    let input = `${data}`.replace(/[\t\n\f\r ]/gu, "");
    if (/[^A-Za-z0-9+/=]/u.test(input)) {
      invalid();
    }
    const padding = /=+$/u.exec(input)?.[0].length ?? 0;
    if (
      padding > 2
      || (padding > 0 && input.length % 4 !== 0)
    ) {
      invalid();
    }
    input = input.slice(0, input.length - padding);
    if (input.length % 4 === 1) {
      invalid();
    }
    if (input.includes("=")) {
      invalid();
    }
    let output = "";
    let buffer = 0;
    let bits = 0;
    for (const character of input) {
      const value = alphabet.indexOf(character);
      if (value === -1) {
        invalid();
      }
      buffer = (buffer << 6) | value;
      bits += 6;
      if (bits >= 8) {
        bits -= 8;
        output += String.fromCharCode((buffer >> bits) & 0xff);
      }
    }
    traceCall("window.atob", "Window", [data], output);
    return output;
  },
}.atob;

registerNativeFunction(atob, "atob");

export function installAtob() {
  defineGlobalFunction("atob", atob);
}

function invalid() {
  throw new DOMException(
    "The string to be decoded is not correctly encoded.",
    "InvalidCharacterError",
  );
}
