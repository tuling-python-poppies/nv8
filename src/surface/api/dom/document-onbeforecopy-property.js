import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onbeforecopy");
export const onbeforecopy = descriptor.get;
export const setOnbeforecopy = descriptor.set;
