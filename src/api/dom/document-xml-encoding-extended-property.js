import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("xmlEncoding", operations.xmlEncodingValue);
export const xmlEncoding = descriptor.get;
