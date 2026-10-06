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
} from "../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../engine/webidl/native-function.js";

export function installCompressionStreams() {

    delete CompressionStream.prototype.constructor;
    defineGlobalConstructor(CompressionStream.name, CompressionStream);

    delete DecompressionStream.prototype.constructor;
    defineGlobalConstructor(DecompressionStream.name, DecompressionStream);

    getter(CompressionStream, "readable", compressionProperty);

    getter(CompressionStream, "writable", compressionProperty);

  finish(CompressionStream);

    getter(DecompressionStream, "readable", decompressionProperty);

    getter(DecompressionStream, "writable", decompressionProperty);

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
