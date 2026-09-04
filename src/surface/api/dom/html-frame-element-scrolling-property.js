import { frameStringProperty } from "./html-frame-element-string-property.js";
const descriptor = frameStringProperty("scrolling", "scrolling");
export const scrolling = descriptor.get;
export const setScrolling = descriptor.set;
