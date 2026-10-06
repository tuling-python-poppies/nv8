import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onreset");
export const onreset = descriptor.get;
export const setOnreset = descriptor.set;
