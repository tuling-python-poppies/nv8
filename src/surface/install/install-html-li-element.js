import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLLIElement,
  installHTMLLIElementConstructor,
} from "../api/dom/html-li-element-constructor.js";
import { stringReflectionTable } from "../api/dom/html-li-element-type-property.js";
import { longReflectionTable } from "../api/dom/html-li-element-value-property.js";

export function installHTMLLIElement() {
  installHTMLLIElementConstructor();
  for (const [name, entry] of longReflectionTable) definePrototypeAccessor(HTMLLIElement.prototype, name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionTable) definePrototypeAccessor(HTMLLIElement.prototype, name, entry.get, entry.set);
  defineConstructorBacklink(HTMLLIElement.prototype, HTMLLIElement);
  defineToStringTag(HTMLLIElement.prototype, "HTMLLIElement");
}
