import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLHRElement,
  installHTMLHRElementConstructor,
} from "../api/dom/html-hr-element-constructor.js";
import {
  stringReflectionPart1Table,
  stringReflectionPart2Table,
} from "../api/dom/string-reflection-htmlhr-element-members.js";
import { booleanReflectionTable } from "../api/dom/html-hr-element-no-shade-property.js";

export function installHTMLHRElement() {
  installHTMLHRElementConstructor();
  for (const [name, entry] of stringReflectionPart1Table) definePrototypeAccessor(HTMLHRElement.prototype, name, entry.get, entry.set);
  for (const [name, entry] of booleanReflectionTable) definePrototypeAccessor( HTMLHRElement.prototype, name, entry.get, entry.set, );
  for (const [name, entry] of stringReflectionPart2Table) definePrototypeAccessor(HTMLHRElement.prototype, name, entry.get, entry.set);
  defineConstructorBacklink(HTMLHRElement.prototype, HTMLHRElement);
  defineToStringTag(HTMLHRElement.prototype, "HTMLHRElement");
}
