import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { TextDecoder } from "./text-decoder-constructor.js";
import { requireTextDecoder } from "./text-decoder-state.js";

export const fatal = Object.getOwnPropertyDescriptor({
  get fatal() {
    const value = requireTextDecoder(this).fatal;
    traceGetter("window.TextDecoder.prototype.fatal", "TextDecoder", value);
    return value;
  },
}, "fatal").get;
registerNativeGetter(fatal, "fatal");
export function installTextDecoderFatal() {
  definePrototypeGetter(TextDecoder.prototype, "fatal", fatal);
}
