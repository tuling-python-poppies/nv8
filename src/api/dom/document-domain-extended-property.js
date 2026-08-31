import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentDescriptor("domain", operations.domainValue, operations.setDomain);
export const domain = descriptor.get;
export const setDomain = descriptor.set;
