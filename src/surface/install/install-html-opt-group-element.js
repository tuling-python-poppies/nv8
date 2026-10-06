import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLOptGroupElement,
  installHTMLOptGroupElementConstructor,
} from "../api/dom/html-opt-group-element-constructor.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";

export function installHTMLOptGroupElement() {
  installHTMLOptGroupElementConstructor();
  for (const [name, entry] of booleanReflectionTable) definePrototypeAccessor( HTMLOptGroupElement.prototype, name, entry.get, entry.set, );
  for (const [name, entry] of stringReflectionTable) definePrototypeAccessor( HTMLOptGroupElement.prototype, name, entry.get, entry.set, );
  defineConstructorBacklink(
    HTMLOptGroupElement.prototype,
    HTMLOptGroupElement,
  );
  defineToStringTag(HTMLOptGroupElement.prototype, "HTMLOptGroupElement");
}
