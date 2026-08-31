import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onfocus");
export const onfocus = descriptor.get;
export const setOnfocus = descriptor.set;
