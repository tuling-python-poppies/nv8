import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("webkitIsFullScreen", operations.fullscreenValue);
export const webkitIsFullScreen = descriptor.get;
