import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onkeydown");
export const onkeydown = descriptor.get;
export const setOnkeydown = descriptor.set;
