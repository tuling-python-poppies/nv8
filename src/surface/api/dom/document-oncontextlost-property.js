import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("oncontextlost");
export const oncontextlost = descriptor.get;
export const setOncontextlost = descriptor.set;
