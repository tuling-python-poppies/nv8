import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { Blob, installBlobConstructor } from "../api/file/blob-constructor.js";
import { slice } from "../api/file/blob-slice.js";
import { stream } from "../api/file/blob-stream.js";
import { textStream } from "../api/file/blob-text-stream.js";
import { blobMethodTable } from "../api/file/blob-method-members.js";
import { blobPropertyTable } from "../api/file/blob-property-members.js";

export function installBlob() {
  installBlobConstructor();
  for (const [name, entry] of blobPropertyTable) definePrototypeGetter(Blob.prototype, name, entry);
  for (const [name, entry] of blobMethodTable) definePrototypeMethod(Blob.prototype, name, entry);
  definePrototypeMethod(Blob.prototype, "slice", slice);
  definePrototypeMethod(Blob.prototype, "stream", stream);
  definePrototypeMethod(Blob.prototype, "textStream", textStream);
  defineConstructorBacklink(Blob.prototype, Blob);
  defineToStringTag(Blob.prototype, "Blob");
}
