import { htmlStringDescriptor } from "./html-element-property.js";
const descriptor = htmlStringDescriptor("dir", "");
export const dir = descriptor.get;
export const setDir = descriptor.set;
