import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireNode } from "./node-state.js";
import { assignedSlotForNode } from "./shadow-root-state.js";
import { Text } from "./text-constructor.js";

export const assignedSlot = Object.getOwnPropertyDescriptor({
  get assignedSlot() {
    requireNode(this);
    const value = assignedSlotForNode(this);
    traceGetter("window.Text.prototype.assignedSlot", "Text", value);
    return value;
  },
}, "assignedSlot").get;
registerNativeGetter(assignedSlot, "assignedSlot");
export function installTextAssignedSlot() {
  definePrototypeGetter(Text.prototype, "assignedSlot", assignedSlot);
}
