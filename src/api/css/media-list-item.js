import { mediaListMethod } from "./media-list-method.js";
export const item = mediaListMethod("item", 1, (record, args) =>
  record.values[Number(args[0]) >>> 0] ?? null);
