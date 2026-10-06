import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onlostpointercapture");
export const onlostpointercapture = descriptor.get;
export const setOnlostpointercapture = descriptor.set;
