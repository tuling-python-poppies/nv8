import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onplaying");
export const onplaying = descriptor.get;
export const setOnplaying = descriptor.set;
