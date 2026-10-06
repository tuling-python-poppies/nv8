import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLHRElement,
  installHTMLHRElementConstructor,
} from "../api/dom/html-hr-element-constructor.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";

export function installHTMLHRElement() {
  installHTMLHRElementConstructor();for (const [name, entry] of stringReflectionTable) definePrototypeAccessor(HTMLHRElement.prototype, name, entry.get, entry.set);for (const [name, entry] of booleanReflectionTable) definePrototypeAccessor( HTMLHRElement.prototype, name, entry.get, entry.set, );for (const [name, entry] of stringReflectionTable) definePrototypeAccessor(HTMLHRElement.prototype, name, entry.get, entry.set);
  defineConstructorBacklink(HTMLHRElement.prototype, HTMLHRElement);
  defineToStringTag(HTMLHRElement.prototype, "HTMLHRElement");
}
