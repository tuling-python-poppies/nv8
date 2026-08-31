import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("scrollingElement", operations.scrollingElementValue);
export const scrollingElement = descriptor.get;
