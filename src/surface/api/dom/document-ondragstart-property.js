import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("ondragstart");
export const ondragstart = descriptor.get;
export const setOndragstart = descriptor.set;
