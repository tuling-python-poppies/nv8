import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("oncut");
export const oncut = descriptor.get;
export const setOncut = descriptor.set;
