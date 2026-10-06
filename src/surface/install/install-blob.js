import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  arrayBuffer,
  bytes,
  text,
} from "../api/file/blob-method-members.js";
import { Blob, installBlobConstructor } from "../api/file/blob-constructor.js";
import {
  size,
  type,
} from "../api/file/blob-property-members.js";
import { slice } from "../api/file/blob-slice.js";
import { stream } from "../api/file/blob-stream.js";
import { textStream } from "../api/file/blob-text-stream.js";

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
