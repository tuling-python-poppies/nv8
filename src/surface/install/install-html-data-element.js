import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLDataElement,
  installHTMLDataElementConstructor,
} from "../api/dom/html-data-element-constructor.js";
import { stringReflectionTable } from "../api/dom/html-data-element-value-property.js";

export function installHTMLDataElement() {
  installHTMLDataElementConstructor();
  for (const [name, entry] of stringReflectionTable) definePrototypeAccessor(HTMLDataElement.prototype, name, entry.get, entry.set);
  defineConstructorBacklink(HTMLDataElement.prototype, HTMLDataElement);
  defineToStringTag(HTMLDataElement.prototype, "HTMLDataElement");
}
