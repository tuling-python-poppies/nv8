import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("ondrag");
export const ondrag = descriptor.get;
export const setOndrag = descriptor.set;
