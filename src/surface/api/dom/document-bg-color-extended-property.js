import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentDescriptor("bgColor", operations.bgColorValue, operations.setBgColor);
export const bgColor = descriptor.get;
export const setBgColor = descriptor.set;
