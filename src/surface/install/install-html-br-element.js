import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLBRElement,
  installHTMLBRElementConstructor,
} from "../api/dom/html-br-element-constructor.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";

export function installHTMLBRElement() {
  installHTMLBRElementConstructor();for (const [name, entry] of stringReflectionTable) definePrototypeAccessor(HTMLBRElement.prototype, name, entry.get, entry.set);
  defineConstructorBacklink(HTMLBRElement.prototype, HTMLBRElement);
  defineToStringTag(HTMLBRElement.prototype, "HTMLBRElement");
}
