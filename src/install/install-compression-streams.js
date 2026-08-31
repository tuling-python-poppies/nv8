import {
  CompressionStream,
  DecompressionStream,
  compressionProperty,
  decompressionProperty,
} from "../api/streams/compression-stream-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { registerNativeGetter } from "../webidl/native-function.js";

export function installCompressionStreams() {
  do {
    delete ((([CompressionStream, DecompressionStream])[0])).prototype.constructor;
    defineGlobalConstructor(((([CompressionStream, DecompressionStream])[0])).name, ((([CompressionStream, DecompressionStream])[0])));
  } while (false);
do {
    delete ((([CompressionStream, DecompressionStream])[1])).prototype.constructor;
    defineGlobalConstructor(((([CompressionStream, DecompressionStream])[1])).name, ((([CompressionStream, DecompressionStream])[1])));
  } while (false);
  do {
    getter(CompressionStream, ("readable"), compressionProperty);
  } while (false);
do {
    getter(CompressionStream, ("writable"), compressionProperty);
  } while (false);
  finish(CompressionStream);
  do {
    getter(DecompressionStream, ("readable"), decompressionProperty);
  } while (false);
do {
    getter(DecompressionStream, ("writable"), decompressionProperty);
  } while (false);
  finish(DecompressionStream);
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
