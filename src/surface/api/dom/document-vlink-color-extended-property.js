import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentDescriptor("vlinkColor", operations.vlinkColorValue, operations.setVlinkColor);
export const vlinkColor = descriptor.get;
export const setVlinkColor = descriptor.set;
