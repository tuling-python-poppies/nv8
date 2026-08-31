import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("oncanplay");
export const oncanplay = descriptor.get;
export const setOncanplay = descriptor.set;
