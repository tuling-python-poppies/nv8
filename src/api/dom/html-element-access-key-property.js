import { htmlStringDescriptor } from "./html-element-property.js";
const descriptor = htmlStringDescriptor("accessKey", "");
export const accessKey = descriptor.get;
export const setAccessKey = descriptor.set;
