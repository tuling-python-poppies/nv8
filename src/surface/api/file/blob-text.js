import { blobMethod } from "./blob-method.js";
import { decodeUtf8 } from "./blob-state.js";
export const text = blobMethod(
  "text",
  state => Promise.resolve(decodeUtf8(state.bytes)),
);
