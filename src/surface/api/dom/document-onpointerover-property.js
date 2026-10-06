import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onpointerover");
export const onpointerover = descriptor.get;
export const setOnpointerover = descriptor.set;
