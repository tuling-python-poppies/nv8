import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { TextDecoder } from "./text-decoder-constructor.js";
import { decodeText, requireTextDecoder } from "./text-decoder-state.js";

export const decode = {
  decode(input = undefined, options = undefined) {
    requireTextDecoder(this);
    const value = decodeText(this, input, options);
    traceCall(
      "window.TextDecoder.prototype.decode",
      "TextDecoder",
      arguments.length === 0 ? [] : [input, options],
      value,
    );
    return value;
  },
}.decode;
registerNativeFunction(decode, "decode");
export function installTextDecoderDecode() {
  definePrototypeMethod(TextDecoder.prototype, "decode", decode);
}
