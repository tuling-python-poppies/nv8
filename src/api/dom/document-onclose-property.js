import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onclose");
export const onclose = descriptor.get;
export const setOnclose = descriptor.set;
