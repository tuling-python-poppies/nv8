import { traceCall } from "../../../infra/trace/trace-function.js";
import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLAudioElement,
  createHTMLAudioElement,
} from "./html-audio-element-constructor.js";

export function Audio(src = "") {
  const result = createHTMLAudioElement("audio", globalThis.document, `${src}`);
  traceCall(
    "window.Audio",
    "Window",
    arguments.length === 0 ? [] : [src],
    result,
  );
  return result;
}
registerNativeFunction(Audio, "Audio");

export function installAudioConstructor() {
  Object.defineProperty(Audio, "prototype", {
    value: HTMLAudioElement.prototype,
    writable: false,
    enumerable: false,
    configurable: false,
  });
  defineGlobalConstructor("Audio", Audio);
}
