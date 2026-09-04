import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("oncanplaythrough");
export const oncanplaythrough = descriptor.get;
export const setOncanplaythrough = descriptor.set;
