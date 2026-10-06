import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onmousemove");
export const onmousemove = descriptor.get;
export const setOnmousemove = descriptor.set;
