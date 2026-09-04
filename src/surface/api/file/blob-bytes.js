import { blobMethod } from "./blob-method.js";
export const bytes = blobMethod(
  "bytes",
  state => Promise.resolve(state.bytes.slice()),
);
