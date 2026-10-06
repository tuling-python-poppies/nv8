import { ariaElementProperty } from "./element-aria-element-property.js";
const d = ariaElementProperty("ariaDescribedByElements", "aria-describedby", true);
export const ariaDescribedByElements = d.get; export const setAriaDescribedByElements = d.set;
