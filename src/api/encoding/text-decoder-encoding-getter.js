import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { TextDecoder } from "./text-decoder-constructor.js";
import { requireTextDecoder } from "./text-decoder-state.js";

export const encoding = Object.getOwnPropertyDescriptor({
  get encoding() {
    const value = requireTextDecoder(this).encoding;
    traceGetter("window.TextDecoder.prototype.encoding", "TextDecoder", value);
    return value;
  },
}, "encoding").get;
registerNativeGetter(encoding, "encoding");
export function installTextDecoderEncoding() {
  definePrototypeGetter(TextDecoder.prototype, "encoding", encoding);
}
