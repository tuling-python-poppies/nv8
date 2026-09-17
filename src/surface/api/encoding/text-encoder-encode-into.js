import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { TextEncoder } from "./text-encoder-constructor.js";
import { requireTextEncoder } from "./text-encoder-state.js";
import { encodeUtf8 } from "./utf-codec.js";

const encodeInto = {
  encodeInto(source, destination) {
    requireTextEncoder(this);
    if (arguments.length < 2) {
      throw new TypeError("encodeInto requires 2 arguments");
    }
    if (!(destination instanceof Uint8Array)) {
      throw new TypeError("destination must be a Uint8Array");
    }
    const input = `${source}`;
    let read = 0;
    let written = 0;
    for (const character of input) {
      const bytes = encodeUtf8(character);
      if (written + bytes.length > destination.length) {
        break;
      }
      destination.set(bytes, written);
      written += bytes.length;
      read += character.length;
    }
    const value = { read, written };
    traceCall(
      "window.TextEncoder.prototype.encodeInto",
      "TextEncoder",
      [input, destination],
      value,
    );
    return value;
  },
}.encodeInto;
registerNativeFunction(encodeInto, "encodeInto");
export function installTextEncoderEncodeInto() {
  definePrototypeMethod(TextEncoder.prototype, "encodeInto", encodeInto);
}
