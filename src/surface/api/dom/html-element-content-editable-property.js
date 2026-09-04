import { htmlStringDescriptor } from "./html-element-property.js";
const descriptor = htmlStringDescriptor("contentEditable", "inherit");
export const contentEditable = descriptor.get;
export const setContentEditable = descriptor.set;
