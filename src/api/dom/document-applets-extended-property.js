import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("applets", operations.appletsValue);
export const applets = descriptor.get;
