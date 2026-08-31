import { elementNullableStringProperty } from "./element-extended-property.js";
const d = elementNullableStringProperty("ariaChecked", "aria-checked");
export const ariaChecked = d.get; export const setAriaChecked = d.set;
