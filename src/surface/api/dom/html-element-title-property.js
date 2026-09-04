import { htmlStringDescriptor } from "./html-element-property.js";
const descriptor = htmlStringDescriptor("title", "");
export const title = descriptor.get;
export const setTitle = descriptor.set;
