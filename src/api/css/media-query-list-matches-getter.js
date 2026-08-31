import { mediaQueryListReadonlyDescriptor } from "./media-query-list-property.js";
export const matches = mediaQueryListReadonlyDescriptor("matches", record => record.matches).get;
