import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onvolumechange");
export const onvolumechange = descriptor.get;
export const setOnvolumechange = descriptor.set;
