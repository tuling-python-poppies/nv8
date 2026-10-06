import { frameStringProperty } from "./html-frame-element-string-property.js";
const descriptor = frameStringProperty("src", "src");
export const src = descriptor.get;
export const setSrc = descriptor.set;
