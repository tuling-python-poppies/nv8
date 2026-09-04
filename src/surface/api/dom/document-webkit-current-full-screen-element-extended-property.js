import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("webkitCurrentFullScreenElement", operations.fullscreenElementValue);
export const webkitCurrentFullScreenElement = descriptor.get;
