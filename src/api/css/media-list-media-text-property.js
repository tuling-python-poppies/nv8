import { mediaListAccessorDescriptor } from "./media-list-property.js";
import { setMediaText } from "./media-list-state.js";
export const mediaText = mediaListAccessorDescriptor(
  "mediaText",
  record => record.values.join(", "),
  setMediaText,
);
