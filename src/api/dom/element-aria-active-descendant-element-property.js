import { ariaElementProperty } from "./element-aria-element-property.js";
const d = ariaElementProperty("ariaActiveDescendantElement", "aria-activedescendant", false);
export const ariaActiveDescendantElement = d.get; export const setAriaActiveDescendantElement = d.set;
