import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onload");
export const onload = descriptor.get;
export const setOnload = descriptor.set;
