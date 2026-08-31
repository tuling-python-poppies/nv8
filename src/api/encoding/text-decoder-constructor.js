import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { initializeTextDecoder } from "./text-decoder-state.js";

export function TextDecoder(label = "utf-8", options = undefined) {
  if (new.target === undefined) {
    throw new TypeError("Failed to construct 'TextDecoder': use new");
  }
  initializeTextDecoder(this, label, options);
}
registerNativeFunction(TextDecoder, "TextDecoder");
export function installTextDecoderConstructor() {
  delete TextDecoder.prototype.constructor;
  defineToStringTag(TextDecoder.prototype, "TextDecoder");
  defineGlobalConstructor("TextDecoder", TextDecoder);
}
export function installTextDecoderConstructorBacklink() {
  defineConstructorBacklink(TextDecoder.prototype, TextDecoder);
}
