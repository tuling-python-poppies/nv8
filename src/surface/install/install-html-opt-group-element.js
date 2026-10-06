import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLOptGroupElement,
  installHTMLOptGroupElementConstructor,
} from "../api/dom/html-opt-group-element-constructor.js";
import {
  label,
  setLabel,
} from "../api/dom/html-opt-group-element-label-property.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";

export function installHTMLOptGroupElement() {
  installHTMLOptGroupElementConstructor();for (const [name, entry] of booleanReflectionTable) definePrototypeAccessor( HTMLOptGroupElement.prototype, name, entry.get, entry.set, );
  definePrototypeAccessor(
    HTMLOptGroupElement.prototype,
    "label",
    label,
    setLabel,
  );
  defineConstructorBacklink(
    HTMLOptGroupElement.prototype,
    HTMLOptGroupElement,
  );
  defineToStringTag(HTMLOptGroupElement.prototype, "HTMLOptGroupElement");
}
