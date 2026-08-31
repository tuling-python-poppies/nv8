import { elementInternalsARIAProperty } from "./element-internals-property.js";
// Edge 151 新增。与 Element.ariaActionsElements 对应，getter+setter。
export const ariaActionsElements = elementInternalsARIAProperty("ariaActionsElements", true);
