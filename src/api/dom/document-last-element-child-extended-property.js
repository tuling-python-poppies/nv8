import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("lastElementChild", operations.lastElementChildValue);
export const lastElementChild = descriptor.get;
