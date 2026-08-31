import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("webkitFullscreenEnabled", operations.trueValue);
export const webkitFullscreenEnabled = descriptor.get;
