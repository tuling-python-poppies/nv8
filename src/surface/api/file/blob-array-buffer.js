import { blobMethod } from "./blob-method.js";
export const arrayBuffer = blobMethod(
  "arrayBuffer",
  state => Promise.resolve(state.bytes.slice().buffer),
);
