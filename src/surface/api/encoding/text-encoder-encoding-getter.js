import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { TextEncoder } from "./text-encoder-constructor.js";
import { requireTextEncoder } from "./text-encoder-state.js";

export const encoding = Object.getOwnPropertyDescriptor({
  get encoding() {
    requireTextEncoder(this);
    traceGetter("window.TextEncoder.prototype.encoding", "TextEncoder", "utf-8");
    return "utf-8";
  },
}, "encoding").get;
registerNativeGetter(encoding, "encoding");
export function installTextEncoderEncoding() {
  definePrototypeGetter(TextEncoder.prototype, "encoding", encoding);
}
