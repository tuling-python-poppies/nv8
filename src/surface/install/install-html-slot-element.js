import {
  definePrototypeMethod,
} from "../../engine/webidl/descriptor.js";
import {
  finishHTMLSlotElementConstructor,
  HTMLSlotElement,
  installHTMLSlotElementConstructor,
} from "../api/dom/html-slot-element-constructor.js";
import { assign } from "../api/dom/html-slot-element-assign.js";
import {
  assignedElements,
} from "../api/dom/html-slot-element-assigned-elements.js";
import {
  assignedNodes,
} from "../api/dom/html-slot-element-assigned-nodes.js";
import {
  installHTMLSlotElementName,
} from "../api/dom/html-slot-element-name-property.js";

export function installHTMLSlotElement() {
  installHTMLSlotElementConstructor();
  installHTMLSlotElementName();
  definePrototypeMethod(HTMLSlotElement.prototype, "assign", assign);
  definePrototypeMethod(
    HTMLSlotElement.prototype,
    "assignedElements",
    assignedElements,
  );
  definePrototypeMethod(
    HTMLSlotElement.prototype,
    "assignedNodes",
    assignedNodes,
  );
  finishHTMLSlotElementConstructor();
}
