import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { TextEncoder } from "./text-encoder-constructor.js";
import { requireTextEncoder } from "./text-encoder-state.js";
import { encodeUtf8 } from "./utf-codec.js";

export const encode = {
  encode(input = "") {
    requireTextEncoder(this);
    const normalized = `${input}`;
    const value = Uint8Array.from(encodeUtf8(normalized));
    traceCall("window.TextEncoder.prototype.encode", "TextEncoder", [normalized], value);
    return value;
  },
}.encode;
registerNativeFunction(encode, "encode");
export function installTextEncoderEncode() {
  definePrototypeMethod(TextEncoder.prototype, "encode", encode);
}
