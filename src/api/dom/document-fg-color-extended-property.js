import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentDescriptor("fgColor", operations.fgColorValue, operations.setFgColor);
export const fgColor = descriptor.get;
export const setFgColor = descriptor.set;
