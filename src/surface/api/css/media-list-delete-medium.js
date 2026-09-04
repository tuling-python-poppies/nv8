import { mediaListMethod } from "./media-list-method.js";
import { refreshMediaList } from "./media-list-state.js";
export const deleteMedium = mediaListMethod("deleteMedium", 1, (record, args, list) => {
  const value = `${args[0]}`;
  const index = record.values.indexOf(value);
  if (index < 0) throw new DOMException("The medium was not found.", "NotFoundError");
  record.values.splice(index, 1);
  refreshMediaList(list);
});
