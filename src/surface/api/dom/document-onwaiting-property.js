import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onwaiting");
export const onwaiting = descriptor.get;
export const setOnwaiting = descriptor.set;
