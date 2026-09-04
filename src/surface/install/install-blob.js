import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { arrayBuffer } from "../api/file/blob-array-buffer.js";
import { Blob, installBlobConstructor } from "../api/file/blob-constructor.js";
import { bytes } from "../api/file/blob-bytes.js";
import { size } from "../api/file/blob-size-getter.js";
import { slice } from "../api/file/blob-slice.js";
import { stream } from "../api/file/blob-stream.js";
import { text } from "../api/file/blob-text.js";
import { textStream } from "../api/file/blob-text-stream.js";
import { type } from "../api/file/blob-type-getter.js";

export function installBlob() {
  installBlobConstructor();
  definePrototypeGetter(Blob.prototype, "size", size);
  definePrototypeGetter(Blob.prototype, "type", type);
  definePrototypeMethod(Blob.prototype, "arrayBuffer", arrayBuffer);
  definePrototypeMethod(Blob.prototype, "slice", slice);
  definePrototypeMethod(Blob.prototype, "stream", stream);
  definePrototypeMethod(Blob.prototype, "text", text);
  definePrototypeMethod(Blob.prototype, "textStream", textStream);
  definePrototypeMethod(Blob.prototype, "bytes", bytes);
  defineConstructorBacklink(Blob.prototype, Blob);
  defineToStringTag(Blob.prototype, "Blob");
}
