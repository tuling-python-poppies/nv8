import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onslotchange");
export const onslotchange = descriptor.get;
export const setOnslotchange = descriptor.set;
