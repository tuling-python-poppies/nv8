import { frameStringProperty } from "./html-frame-element-string-property.js";
const descriptor = frameStringProperty("frameBorder", "frameborder");
export const frameBorder = descriptor.get;
export const setFrameBorder = descriptor.set;
