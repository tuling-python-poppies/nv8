import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { requireElement } from "./element-state.js";
import { assignedSlotForNode } from "./shadow-root-state.js";

export const assignedSlot = Object.getOwnPropertyDescriptor({
  get assignedSlot() {
    requireElement(this);
    const result = assignedSlotForNode(this);
    traceGetter(
      "window.Element.prototype.assignedSlot",
      "Element",
      result,
    );
    return result;
  },
}, "assignedSlot").get;
registerNativeGetter(assignedSlot, "assignedSlot");

export function installElementAssignedSlot() {
  definePrototypeGetter(Element.prototype, "assignedSlot", assignedSlot);
}
