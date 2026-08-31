import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentDescriptor("designMode", operations.designModeValue, operations.setDesignMode);
export const designMode = descriptor.get;
export const setDesignMode = descriptor.set;
