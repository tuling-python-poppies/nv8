import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("oncontextrestored");
export const oncontextrestored = descriptor.get;
export const setOncontextrestored = descriptor.set;
