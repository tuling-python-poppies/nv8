import { mediaQueryListReadonlyDescriptor } from "./media-query-list-property.js";
export const media = mediaQueryListReadonlyDescriptor("media", record => record.media).get;
