import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("oncopy");
export const oncopy = descriptor.get;
export const setOncopy = descriptor.set;
