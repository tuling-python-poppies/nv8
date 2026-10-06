import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLTimeElement,
  installHTMLTimeElementConstructor,
} from "../api/dom/html-time-element-constructor.js";
import { stringReflectionTable } from "../api/dom/html-time-element-date-time-property.js";

export function installHTMLTimeElement() {
  installHTMLTimeElementConstructor();
  for (const [name, entry] of stringReflectionTable) definePrototypeAccessor( HTMLTimeElement.prototype, name, entry.get, entry.set, );
  defineConstructorBacklink(HTMLTimeElement.prototype, HTMLTimeElement);
  defineToStringTag(HTMLTimeElement.prototype, "HTMLTimeElement");
}
