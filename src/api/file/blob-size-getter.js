import { blobProperty } from "./blob-property.js";
export const size = blobProperty("size", state => state.bytes.length);
