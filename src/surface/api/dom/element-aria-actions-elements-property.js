import { ariaElementProperty } from "./element-aria-element-property.js";
// Edge 151 新增的 ARIA 元素引用反射。真实 Edge 实测：getter+setter，
// enumerable+configurable，未设置时读作 null——与其他 aria*Elements 一致。
const d = ariaElementProperty("ariaActionsElements", "aria-actions", true);
export const ariaActionsElements = d.get; export const setAriaActionsElements = d.set;
