import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentDescriptor("linkColor", operations.linkColorValue, operations.setLinkColor);
export const linkColor = descriptor.get;
export const setLinkColor = descriptor.set;
