import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("ondrop");
export const ondrop = descriptor.get;
export const setOndrop = descriptor.set;
