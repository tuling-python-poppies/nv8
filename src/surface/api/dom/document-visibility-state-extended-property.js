import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("visibilityState", operations.visibleValue);
export const visibilityState = descriptor.get;
