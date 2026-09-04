import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onpointermove");
export const onpointermove = descriptor.get;
export const setOnpointermove = descriptor.set;
