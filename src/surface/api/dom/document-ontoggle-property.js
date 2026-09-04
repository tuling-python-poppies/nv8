import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("ontoggle");
export const ontoggle = descriptor.get;
export const setOntoggle = descriptor.set;
