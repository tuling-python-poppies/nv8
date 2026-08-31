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
} from "../webidl/descriptor.js";
import { registerNativeGetter } from "../webidl/native-function.js";

export function installTextStreams() {
  do {
    delete ((([TextEncoderStream, TextDecoderStream])[0])).prototype.constructor;
    defineGlobalConstructor(((([TextEncoderStream, TextDecoderStream])[0])).name, ((([TextEncoderStream, TextDecoderStream])[0])));
  } while (false);
do {
    delete ((([TextEncoderStream, TextDecoderStream])[1])).prototype.constructor;
    defineGlobalConstructor(((([TextEncoderStream, TextDecoderStream])[1])).name, ((([TextEncoderStream, TextDecoderStream])[1])));
  } while (false);
  do {
    getter(TextEncoderStream, ("encoding"), encoderProperty);
  } while (false);
do {
    getter(TextEncoderStream, ("readable"), encoderProperty);
  } while (false);
do {
    getter(TextEncoderStream, ("writable"), encoderProperty);
  } while (false);
  finish(TextEncoderStream);
  do {
    getter(TextDecoderStream, ("encoding"), decoderProperty);
  } while (false);
do {
    getter(TextDecoderStream, ("fatal"), decoderProperty);
  } while (false);
do {
    getter(TextDecoderStream, ("ignoreBOM"), decoderProperty);
  } while (false);
do {
    getter(TextDecoderStream, ("readable"), decoderProperty);
  } while (false);
do {
    getter(TextDecoderStream, ("writable"), decoderProperty);
  } while (false);
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
