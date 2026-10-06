import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLMenuElement,
  installHTMLMenuElementConstructor,
} from "../api/dom/html-menu-element-constructor.js";
import { booleanReflectionTable } from "../api/dom/html-menu-element-compact-property.js";

export function installHTMLMenuElement() {
  installHTMLMenuElementConstructor();
  for (const [name, entry] of booleanReflectionTable) definePrototypeAccessor( HTMLMenuElement.prototype, name, entry.get, entry.set, );
  defineConstructorBacklink(HTMLMenuElement.prototype, HTMLMenuElement);
  defineToStringTag(HTMLMenuElement.prototype, "HTMLMenuElement");
}
