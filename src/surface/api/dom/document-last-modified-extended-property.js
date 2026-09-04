import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("lastModified", operations.lastModifiedValue);
export const lastModified = descriptor.get;
