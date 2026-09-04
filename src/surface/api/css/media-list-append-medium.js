import { mediaListMethod } from "./media-list-method.js";
import { refreshMediaList } from "./media-list-state.js";
export const appendMedium = mediaListMethod("appendMedium", 1, (record, args, list) => {
  const value = `${args[0]}`.trim();
  if (value !== "" && !record.values.includes(value)) record.values.push(value);
  refreshMediaList(list);
});
