import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("oncontextrestored");
export const oncontextrestored = descriptor.get;
export const setOncontextrestored = descriptor.set;
