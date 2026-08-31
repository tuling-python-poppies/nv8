import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onemptied");
export const onemptied = descriptor.get;
export const setOnemptied = descriptor.set;
