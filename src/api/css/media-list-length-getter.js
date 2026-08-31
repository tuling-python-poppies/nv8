import { mediaListReadonlyDescriptor } from "./media-list-property.js";
export const length = mediaListReadonlyDescriptor("length", record => record.values.length).get;
