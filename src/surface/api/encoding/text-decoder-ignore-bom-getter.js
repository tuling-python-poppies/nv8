import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { TextDecoder } from "./text-decoder-constructor.js";
import { requireTextDecoder } from "./text-decoder-state.js";

export const ignoreBOM = Object.getOwnPropertyDescriptor({
  get ignoreBOM() {
    const value = requireTextDecoder(this).ignoreBOM;
    traceGetter("window.TextDecoder.prototype.ignoreBOM", "TextDecoder", value);
    return value;
  },
}, "ignoreBOM").get;
registerNativeGetter(ignoreBOM, "ignoreBOM");
export function installTextDecoderIgnoreBOM() {
  definePrototypeGetter(TextDecoder.prototype, "ignoreBOM", ignoreBOM);
}
