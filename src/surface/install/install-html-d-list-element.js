import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLDListElement,
  installHTMLDListElementConstructor,
} from "../api/dom/html-d-list-element-constructor.js";
import { booleanReflectionTable } from "../api/dom/html-d-list-element-compact-property.js";

export function installHTMLDListElement() {
  installHTMLDListElementConstructor();
  for (const [name, entry] of booleanReflectionTable) definePrototypeAccessor( HTMLDListElement.prototype, name, entry.get, entry.set, );
  defineConstructorBacklink(HTMLDListElement.prototype, HTMLDListElement);
  defineToStringTag(HTMLDListElement.prototype, "HTMLDListElement");
}
