import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onmouseenter");
export const onmouseenter = descriptor.get;
export const setOnmouseenter = descriptor.set;
