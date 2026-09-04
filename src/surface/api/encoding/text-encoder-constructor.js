import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { initializeTextEncoder } from "./text-encoder-state.js";

export function TextEncoder() {
  if (new.target === undefined) {
    throw new TypeError("Failed to construct 'TextEncoder': use new");
  }
  initializeTextEncoder(this);
}
registerNativeFunction(TextEncoder, "TextEncoder");
export function installTextEncoderConstructor() {
  delete TextEncoder.prototype.constructor;
  defineToStringTag(TextEncoder.prototype, "TextEncoder");
  defineGlobalConstructor("TextEncoder", TextEncoder);
}
export function installTextEncoderConstructorBacklink() {
  defineConstructorBacklink(TextEncoder.prototype, TextEncoder);
}
