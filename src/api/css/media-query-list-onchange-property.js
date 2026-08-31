import { mediaQueryListAccessorDescriptor } from "./media-query-list-property.js";
export const onchange = mediaQueryListAccessorDescriptor(
  "onchange",
  record => record.onchange,
  (record, value) => { record.onchange = typeof value === "function" ? value : null; },
);
