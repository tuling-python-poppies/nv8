import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("webkitHidden", operations.falseValue);
export const webkitHidden = descriptor.get;
