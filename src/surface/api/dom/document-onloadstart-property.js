import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onloadstart");
export const onloadstart = descriptor.get;
export const setOnloadstart = descriptor.set;
