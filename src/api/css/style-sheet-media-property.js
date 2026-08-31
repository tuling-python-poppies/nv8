import { createMediaList } from "./media-list-state.js";
import { styleSheetAccessorDescriptor } from "./style-sheet-property.js";
export const media = styleSheetAccessorDescriptor(
  "media",
  record => record.media,
  (record, value) => {
    record.media = Object.prototype.toString.call(value) === "[object MediaList]"
      ? value
      : createMediaList(value);
  },
);
