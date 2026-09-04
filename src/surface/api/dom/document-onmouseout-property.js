import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onmouseout");
export const onmouseout = descriptor.get;
export const setOnmouseout = descriptor.set;
