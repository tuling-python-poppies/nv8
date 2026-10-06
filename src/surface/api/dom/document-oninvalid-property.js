import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("oninvalid");
export const oninvalid = descriptor.get;
export const setOninvalid = descriptor.set;
