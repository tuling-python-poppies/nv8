import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onbeforecut");
export const onbeforecut = descriptor.get;
export const setOnbeforecut = descriptor.set;
