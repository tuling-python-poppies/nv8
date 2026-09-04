import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("ontimeupdate");
export const ontimeupdate = descriptor.get;
export const setOntimeupdate = descriptor.set;
