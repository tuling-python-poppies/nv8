import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("oninput");
export const oninput = descriptor.get;
export const setOninput = descriptor.set;
