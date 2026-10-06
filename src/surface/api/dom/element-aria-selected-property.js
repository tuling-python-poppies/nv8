import { elementNullableStringProperty } from "./element-extended-property.js";
const d = elementNullableStringProperty("ariaSelected", "aria-selected");
export const ariaSelected = d.get; export const setAriaSelected = d.set;
