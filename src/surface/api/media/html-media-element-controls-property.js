import { mediaProperty } from "./html-media-element-property.js";
const descriptor = mediaProperty("controls", Boolean);
export const controls = descriptor.get;
export const setControls = descriptor.set;
