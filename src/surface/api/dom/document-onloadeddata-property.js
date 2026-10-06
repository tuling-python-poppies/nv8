import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onloadeddata");
export const onloadeddata = descriptor.get;
export const setOnloadeddata = descriptor.set;
