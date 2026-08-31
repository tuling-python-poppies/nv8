import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("fullscreenEnabled", operations.trueValue);
export const fullscreenEnabled = descriptor.get;
