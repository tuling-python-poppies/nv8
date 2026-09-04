import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onbeforeinput");
export const onbeforeinput = descriptor.get;
export const setOnbeforeinput = descriptor.set;
