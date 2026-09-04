import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onpointerdown");
export const onpointerdown = descriptor.get;
export const setOnpointerdown = descriptor.set;
