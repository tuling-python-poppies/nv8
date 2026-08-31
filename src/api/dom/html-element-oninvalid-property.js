import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("oninvalid");
export const oninvalid = descriptor.get;
export const setOninvalid = descriptor.set;
