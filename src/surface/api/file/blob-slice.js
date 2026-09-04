import { blobMethod } from "./blob-method.js";
import { createBlob } from "./blob-state.js";

export const slice = blobMethod("slice", (state, args) => {
  const length = state.bytes.length;
  const start = normalizeIndex(args[0], length, 0);
  const end = normalizeIndex(args[1], length, length);
  return createBlob(
    state.bytes.slice(start, Math.max(start, end)),
    args[2] === undefined ? "" : args[2],
  );
});

function normalizeIndex(value, length, fallback) {
  if (value === undefined) return fallback;
  const integer = Math.trunc(Number(value)) || 0;
  return integer < 0
    ? Math.max(length + integer, 0)
    : Math.min(integer, length);
}
