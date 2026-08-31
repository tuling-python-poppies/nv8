import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentDescriptor("dir", operations.dirValue, operations.setDir);
export const dir = descriptor.get;
export const setDir = descriptor.set;
