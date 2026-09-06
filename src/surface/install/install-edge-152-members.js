import {
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
} from "../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../engine/webidl/native-function.js";
import { HTMLInputElement } from "../api/dom/html-input-element-constructor.js";
import {
  normalizedInputType,
  requireInput,
} from "../api/dom/html-input-element-state.js";
import {
  createValueRange as createValueRangeForValue,
} from "../api/dom/html-create-value-range.js";
import { HTMLTextAreaElement } from "../api/dom/html-text-area-element-constructor.js";
import { requireTextArea } from "../api/dom/html-text-area-element-state.js";
import {
  referenceTarget,
  setReferenceTarget,
} from "../api/dom/shadow-root-reference-target-property.js";
import { ShadowRoot } from "../api/dom/shadow-root-constructor.js";
import {
  setShadowRootReferenceTarget,
  setShadowRootSlotAssignment,
  shadowRootReferenceTarget,
  shadowRootSlotAssignment,
} from "../api/dom/html-template-element-shadow-root-152-properties.js";
import { HTMLTemplateElement } from "../api/dom/html-template-element-constructor.js";
import { installNavigatorCPUPerformance } from "../api/navigator/navigator-cpu-performance-getter.js";

/** Install only members introduced by Edge 152. */
export function installEdge152Members() {
  installInputValueRange();
  installTextAreaValueRange();
  definePrototypeAccessor(
    HTMLTemplateElement.prototype,
    "shadowRootReferenceTarget",
    shadowRootReferenceTarget,
    setShadowRootReferenceTarget,
  );
  definePrototypeAccessor(
    HTMLTemplateElement.prototype,
    "shadowRootSlotAssignment",
    shadowRootSlotAssignment,
    setShadowRootSlotAssignment,
  );
  definePrototypeAccessor(
    ShadowRoot.prototype,
    "referenceTarget",
    referenceTarget,
    setReferenceTarget,
  );
  installNavigatorCPUPerformance();
}

function installInputValueRange() {
  definePrototypeMethod(
    HTMLInputElement.prototype,
    "createValueRange",
    inputCreateValueRange,
  );
}

function installTextAreaValueRange() {
  definePrototypeMethod(
    HTMLTextAreaElement.prototype,
    "createValueRange",
    textAreaCreateValueRange,
  );
}

function inputCreateValueRange(start, end) {
  const input = requireInput(this);
  return createValueRangeForValue(
    start,
    end,
    input.value,
    "HTMLInputElement",
    normalizedInputType(this),
  );
}
registerNativeFunction(inputCreateValueRange, "createValueRange");

function textAreaCreateValueRange(start, end) {
  const textArea = requireTextArea(this);
  return createValueRangeForValue(
    start,
    end,
    textArea.value,
    "HTMLTextAreaElement",
  );
}
registerNativeFunction(textAreaCreateValueRange, "createValueRange");
