import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentDescriptor("alinkColor", operations.alinkColorValue, operations.setAlinkColor);
export const alinkColor = descriptor.get;
export const setAlinkColor = descriptor.set;
