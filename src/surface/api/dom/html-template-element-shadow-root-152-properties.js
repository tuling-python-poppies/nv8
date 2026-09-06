import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTemplate } from "./html-template-element-state.js";

const referenceDescriptor = Object.getOwnPropertyDescriptor({
  get shadowRootReferenceTarget() {
    const value = this.getAttribute("shadowrootreferencetarget")
      ?? requireTemplate(this).shadowRootReferenceTarget;
    traceGetter("window.HTMLTemplateElement.prototype.shadowRootReferenceTarget", "HTMLTemplateElement", value);
    return value;
  },
  set shadowRootReferenceTarget(value) {
    const normalized = value === null ? null : `${value}`;
    requireTemplate(this).shadowRootReferenceTarget = normalized;
    if (normalized === null) this.removeAttribute("shadowrootreferencetarget");
    else this.setAttribute("shadowrootreferencetarget", normalized);
  },
}, "shadowRootReferenceTarget");
export const shadowRootReferenceTarget = referenceDescriptor.get;
export const setShadowRootReferenceTarget = referenceDescriptor.set;
registerNativeGetter(shadowRootReferenceTarget, "shadowRootReferenceTarget");
registerNativeFunction(setShadowRootReferenceTarget, "set shadowRootReferenceTarget");

const slotDescriptor = Object.getOwnPropertyDescriptor({
  get shadowRootSlotAssignment() {
    const value = this.getAttribute("shadowrootslotassignment")
      ?? requireTemplate(this).shadowRootSlotAssignment;
    traceGetter("window.HTMLTemplateElement.prototype.shadowRootSlotAssignment", "HTMLTemplateElement", value);
    return value;
  },
  set shadowRootSlotAssignment(value) {
    const normalized = `${value}`;
    requireTemplate(this).shadowRootSlotAssignment = normalized;
    this.setAttribute("shadowrootslotassignment", normalized);
  },
}, "shadowRootSlotAssignment");
export const shadowRootSlotAssignment = slotDescriptor.get;
export const setShadowRootSlotAssignment = slotDescriptor.set;
registerNativeGetter(shadowRootSlotAssignment, "shadowRootSlotAssignment");
registerNativeFunction(setShadowRootSlotAssignment, "set shadowRootSlotAssignment");
