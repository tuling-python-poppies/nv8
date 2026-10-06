import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onauxclick");
export const onauxclick = descriptor.get;
export const setOnauxclick = descriptor.set;
