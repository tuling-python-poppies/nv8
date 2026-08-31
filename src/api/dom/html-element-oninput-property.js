import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("oninput");
export const oninput = descriptor.get;
export const setOninput = descriptor.set;
