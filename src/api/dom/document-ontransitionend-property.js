import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("ontransitionend");
export const ontransitionend = descriptor.get;
export const setOntransitionend = descriptor.set;
