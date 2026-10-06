import { elementNullableStringProperty } from "./element-extended-property.js";
const d = elementNullableStringProperty("ariaDescription", "aria-description");
export const ariaDescription = d.get; export const setAriaDescription = d.set;
