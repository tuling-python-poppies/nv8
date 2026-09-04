import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentDescriptor("xmlStandalone", operations.xmlStandaloneValue, operations.setXmlStandalone);
export const xmlStandalone = descriptor.get;
export const setXmlStandalone = descriptor.set;
