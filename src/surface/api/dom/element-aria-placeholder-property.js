import { elementNullableStringProperty } from "./element-extended-property.js";
const d = elementNullableStringProperty("ariaPlaceholder", "aria-placeholder");
export const ariaPlaceholder = d.get; export const setAriaPlaceholder = d.set;
