import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("ondragenter");
export const ondragenter = descriptor.get;
export const setOndragenter = descriptor.set;
