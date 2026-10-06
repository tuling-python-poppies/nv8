import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onloadedmetadata");
export const onloadedmetadata = descriptor.get;
export const setOnloadedmetadata = descriptor.set;
