import { frameStringProperty } from "./html-frame-element-string-property.js";
const descriptor = frameStringProperty("marginHeight", "marginheight");
export const marginHeight = descriptor.get;
export const setMarginHeight = descriptor.set;
