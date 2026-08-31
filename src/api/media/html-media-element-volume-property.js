import { mediaProperty } from "./html-media-element-property.js";
const descriptor = mediaProperty("volume", value => {
  const normalized = Number(value);
  if (!(normalized >= 0 && normalized <= 1)) {
    throw new RangeError("The volume provided is outside the range [0, 1]");
  }
  return normalized;
});
export const volume = descriptor.get;
export const setVolume = descriptor.set;
