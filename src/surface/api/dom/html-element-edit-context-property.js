import { htmlStateDescriptor } from "./html-element-property.js";
const descriptor = htmlStateDescriptor(
  "editContext",
  null,
  value => (
    (typeof value === "object" && value !== null)
      || typeof value === "function"
  ) ? value : null,
);
export const editContext = descriptor.get;
export const setEditContext = descriptor.set;
