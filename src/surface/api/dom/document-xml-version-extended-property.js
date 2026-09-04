import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentDescriptor("xmlVersion", operations.xmlVersionValue, operations.setXmlVersion);
export const xmlVersion = descriptor.get;
export const setXmlVersion = descriptor.set;
