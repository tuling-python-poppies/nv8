import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("ondragend");
export const ondragend = descriptor.get;
export const setOndragend = descriptor.set;
