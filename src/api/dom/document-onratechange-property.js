import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onratechange");
export const onratechange = descriptor.get;
export const setOnratechange = descriptor.set;
