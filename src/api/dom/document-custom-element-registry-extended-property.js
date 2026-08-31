import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("customElementRegistry", operations.customElementRegistryValue);
export const customElementRegistry = descriptor.get;
