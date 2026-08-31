import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("ondragleave");
export const ondragleave = descriptor.get;
export const setOndragleave = descriptor.set;
