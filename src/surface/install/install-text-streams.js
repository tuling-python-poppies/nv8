import {
  TextDecoderStream,
  TextEncoderStream,
  decoderProperty,
  encoderProperty,
} from "../api/streams/text-stream-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../engine/webidl/native-function.js";

export function installTextStreams() {

    delete TextEncoderStream.prototype.constructor;
    defineGlobalConstructor(TextEncoderStream.name, TextEncoderStream);

    delete TextDecoderStream.prototype.constructor;
    defineGlobalConstructor(TextDecoderStream.name, TextDecoderStream);

    getter(TextEncoderStream, "encoding", encoderProperty);

    getter(TextEncoderStream, "readable", encoderProperty);

    getter(TextEncoderStream, "writable", encoderProperty);

  finish(TextEncoderStream);

    getter(TextDecoderStream, "encoding", decoderProperty);

    getter(TextDecoderStream, "fatal", decoderProperty);

    getter(TextDecoderStream, "ignoreBOM", decoderProperty);

    getter(TextDecoderStream, "readable", decoderProperty);

    getter(TextDecoderStream, "writable", decoderProperty);

  finish(TextDecoderStream);
}

function getter(constructor, name, operation) {
  const callback = function () {
    return operation(this, name);
  };
  registerNativeGetter(callback, name);
  definePrototypeGetter(constructor.prototype, name, callback);
}

function finish(constructor) {
  defineConstructorBacklink(constructor.prototype, constructor);
  defineToStringTag(constructor.prototype, constructor.name);
}
