import { elementNullableStringProperty } from "./element-extended-property.js";
const d = elementNullableStringProperty("ariaDisabled", "aria-disabled");
export const ariaDisabled = d.get; export const setAriaDisabled = d.set;
