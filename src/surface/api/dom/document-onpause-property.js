import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onpause");
export const onpause = descriptor.get;
export const setOnpause = descriptor.set;
