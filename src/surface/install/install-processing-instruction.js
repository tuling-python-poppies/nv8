import {
  definePrototypeGetter,
  definePrototypeMethod,
} from "../../engine/webidl/descriptor.js";
import {
  finishProcessingInstructionConstructor,
  installProcessingInstructionConstructor,
  ProcessingInstruction,
} from "../api/dom/processing-instruction-constructor.js";
import {
  getAttribute,
} from "../api/dom/processing-instruction-get-attribute.js";
import {
  getAttributeNames,
} from "../api/dom/processing-instruction-get-attribute-names.js";
import {
  hasAttribute,
} from "../api/dom/processing-instruction-has-attribute.js";
import {
  hasAttributes,
} from "../api/dom/processing-instruction-has-attributes.js";
import {
  removeAttribute,
} from "../api/dom/processing-instruction-remove-attribute.js";
import {
  setAttribute,
} from "../api/dom/processing-instruction-set-attribute.js";
import {
  sheet,
} from "../api/dom/processing-instruction-sheet-getter.js";
import {
  target,
} from "../api/dom/processing-instruction-target-getter.js";
import {
  toggleAttribute,
} from "../api/dom/processing-instruction-toggle-attribute.js";

export function installProcessingInstruction() {
  installProcessingInstructionConstructor();
  definePrototypeGetter(
    ProcessingInstruction.prototype,
    "target",
    target,
  );
  definePrototypeGetter(
    ProcessingInstruction.prototype,
    "sheet",
    sheet,
  );
  definePrototypeMethod(
    ProcessingInstruction.prototype,
    "getAttribute",
    getAttribute,
  );
  definePrototypeMethod(
    ProcessingInstruction.prototype,
    "getAttributeNames",
    getAttributeNames,
  );
  definePrototypeMethod(
    ProcessingInstruction.prototype,
    "hasAttribute",
    hasAttribute,
  );
  definePrototypeMethod(
    ProcessingInstruction.prototype,
    "hasAttributes",
    hasAttributes,
  );
  definePrototypeMethod(
    ProcessingInstruction.prototype,
    "removeAttribute",
    removeAttribute,
  );
  definePrototypeMethod(
    ProcessingInstruction.prototype,
    "setAttribute",
    setAttribute,
  );
  definePrototypeMethod(
    ProcessingInstruction.prototype,
    "toggleAttribute",
    toggleAttribute,
  );
  finishProcessingInstructionConstructor();
}
