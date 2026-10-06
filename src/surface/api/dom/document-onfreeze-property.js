import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onfreeze");
export const onfreeze = descriptor.get;
export const setOnfreeze = descriptor.set;
