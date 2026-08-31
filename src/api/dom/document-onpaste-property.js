import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onpaste");
export const onpaste = descriptor.get;
export const setOnpaste = descriptor.set;
