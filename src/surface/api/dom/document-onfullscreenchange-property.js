import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onfullscreenchange");
export const onfullscreenchange = descriptor.get;
export const setOnfullscreenchange = descriptor.set;
