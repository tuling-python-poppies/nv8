import { mediaProperty } from "./html-media-element-property.js";
const descriptor = mediaProperty(
  "loading",
  value => `${value}` === "lazy" ? "lazy" : "eager",
);
export const loading = descriptor.get;
export const setLoading = descriptor.set;
