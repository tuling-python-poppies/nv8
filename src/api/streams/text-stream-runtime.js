import { registerNativeFunction } from "../../webidl/native-function.js";

const encoderState = new WeakMap();
const decoderState = new WeakMap();

export function TextEncoderStream() {
  if (!new.target) throw new TypeError("Constructor requires 'new'");
  const encoder = new TextEncoder();
  const transform = new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(encoder.encode(`${chunk}`));
    },
  });
  encoderState.set(this, { transform });
}
registerNativeFunction(TextEncoderStream, "TextEncoderStream");

export function TextDecoderStream() {
  if (!new.target) throw new TypeError("Constructor requires 'new'");
  const label = arguments[0] ?? "utf-8";
  const options = arguments[1] ?? {};
  const decoder = new TextDecoder(label, options);
  const transform = new TransformStream({
    transform(chunk, controller) {
      const text = decoder.decode(chunk, { stream: true });
      if (text !== "") controller.enqueue(text);
    },
    flush(controller) {
      const text = decoder.decode();
      if (text !== "") controller.enqueue(text);
    },
  });
  decoderState.set(this, { transform, decoder });
}
registerNativeFunction(TextDecoderStream, "TextDecoderStream");

export function encoderProperty(stream, name) {
  const state = encoderState.get(stream);
  if (state === undefined) throw new TypeError("Illegal invocation");
  if (name === "encoding") return "utf-8";
  return state.transform[name];
}

export function decoderProperty(stream, name) {
  const state = decoderState.get(stream);
  if (state === undefined) throw new TypeError("Illegal invocation");
  if (name === "encoding") return state.decoder.encoding;
  if (name === "fatal") return state.decoder.fatal;
  if (name === "ignoreBOM") return state.decoder.ignoreBOM;
  return state.transform[name];
}
