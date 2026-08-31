import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentDescriptor("adoptedStyleSheets", operations.adoptedStyleSheetsValue, operations.setAdoptedStyleSheets);
export const adoptedStyleSheets = descriptor.get;
export const setAdoptedStyleSheets = descriptor.set;
