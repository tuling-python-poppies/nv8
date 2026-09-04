import { elementNullableStringProperty } from "./element-extended-property.js";
const d = elementNullableStringProperty("ariaHidden", "aria-hidden");
export const ariaHidden = d.get; export const setAriaHidden = d.set;
