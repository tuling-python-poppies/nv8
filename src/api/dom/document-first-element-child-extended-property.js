import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("firstElementChild", operations.firstElementChildValue);
export const firstElementChild = descriptor.get;
