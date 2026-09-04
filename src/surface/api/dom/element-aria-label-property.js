import { elementNullableStringProperty } from "./element-extended-property.js";
const d = elementNullableStringProperty("ariaLabel", "aria-label");
export const ariaLabel = d.get; export const setAriaLabel = d.set;
