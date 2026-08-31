import { elementNullableStringProperty } from "./element-extended-property.js";
const d = elementNullableStringProperty("ariaExpanded", "aria-expanded");
export const ariaExpanded = d.get; export const setAriaExpanded = d.set;
