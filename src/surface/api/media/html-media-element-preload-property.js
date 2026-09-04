import { mediaProperty } from "./html-media-element-property.js";
const valid = new Set(["none", "metadata", "auto", ""]);
const descriptor = mediaProperty("preload", value => {
  const normalized = `${value}`;
  return valid.has(normalized) ? normalized : "metadata";
});
export const preload = descriptor.get;
export const setPreload = descriptor.set;
