import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("childElementCount", operations.childElementCountValue);
export const childElementCount = descriptor.get;
