import { ariaElementProperty } from "./element-aria-element-property.js";
const d = ariaElementProperty("ariaLabelledByElements", "aria-labelledby", true);
export const ariaLabelledByElements = d.get; export const setAriaLabelledByElements = d.set;
