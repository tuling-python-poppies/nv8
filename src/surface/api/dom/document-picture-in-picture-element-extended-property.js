import * as operations from "./document-extended-property-operations.js";
import { documentDescriptor, documentReadonlyDescriptor } from "./document-property.js";
const descriptor = documentReadonlyDescriptor("pictureInPictureElement", operations.nullValue);
export const pictureInPictureElement = descriptor.get;
