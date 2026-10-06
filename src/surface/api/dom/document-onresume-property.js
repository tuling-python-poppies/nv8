import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onresume");
export const onresume = descriptor.get;
export const setOnresume = descriptor.set;
