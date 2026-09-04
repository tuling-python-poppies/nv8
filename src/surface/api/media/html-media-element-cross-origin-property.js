import { mediaProperty } from "./html-media-element-property.js";
const descriptor = mediaProperty("crossOrigin", value => {
  if (value === null) return null;
  return `${value}` === "use-credentials" ? "use-credentials" : "anonymous";
});
export const crossOrigin = descriptor.get;
export const setCrossOrigin = descriptor.set;
