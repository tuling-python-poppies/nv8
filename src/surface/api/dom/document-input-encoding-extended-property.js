import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("inputEncoding", operations.characterSetAlias);
export const inputEncoding = descriptor.get;
