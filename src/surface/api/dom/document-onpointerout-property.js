import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onpointerout");
export const onpointerout = descriptor.get;
export const setOnpointerout = descriptor.set;
