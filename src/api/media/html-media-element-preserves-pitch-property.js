import { mediaProperty } from "./html-media-element-property.js";
const descriptor = mediaProperty("preservesPitch", Boolean);
export const preservesPitch = descriptor.get;
export const setPreservesPitch = descriptor.set;
