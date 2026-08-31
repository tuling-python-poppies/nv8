import { frameStringProperty } from "./html-frame-element-string-property.js";
const descriptor = frameStringProperty("marginWidth", "marginwidth");
export const marginWidth = descriptor.get;
export const setMarginWidth = descriptor.set;
