import { elementNullableStringProperty } from "./element-extended-property.js";
const d = elementNullableStringProperty("ariaReadOnly", "aria-readonly");
export const ariaReadOnly = d.get; export const setAriaReadOnly = d.set;
