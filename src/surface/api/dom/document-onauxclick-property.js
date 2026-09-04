import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onauxclick");
export const onauxclick = descriptor.get;
export const setOnauxclick = descriptor.set;
