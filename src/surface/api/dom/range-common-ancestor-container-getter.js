import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { commonAncestor } from "./range-state.js";
import { Range } from "./range-constructor.js";

export const commonAncestorContainer = Object.getOwnPropertyDescriptor({
  get commonAncestorContainer() {
    const value = commonAncestor(this);
    traceGetter("window.Range.prototype.commonAncestorContainer", "Range", value);
    return value;
  },
}, "commonAncestorContainer").get;
registerNativeGetter(commonAncestorContainer, "commonAncestorContainer");
export function installRangeCommonAncestorContainer() {
  definePrototypeGetter(
    Range.prototype,
    "commonAncestorContainer",
    commonAncestorContainer,
  );
}
