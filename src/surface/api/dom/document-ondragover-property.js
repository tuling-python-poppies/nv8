import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("ondragover");
export const ondragover = descriptor.get;
export const setOndragover = descriptor.set;
