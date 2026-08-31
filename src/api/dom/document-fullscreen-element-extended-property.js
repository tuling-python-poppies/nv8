import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("fullscreenElement", operations.fullscreenElementValue);
export const fullscreenElement = descriptor.get;
