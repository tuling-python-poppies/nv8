import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onscroll");
export const onscroll = descriptor.get;
export const setOnscroll = descriptor.set;
