import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLOListElement,
  installHTMLOListElementConstructor,
} from "../api/dom/html-o-list-element-constructor.js";
import {
  booleanReflectionPart1Table,
  booleanReflectionPart2Table,
} from "../api/dom/boolean-reflection-htmlo-list-element-members.js";
import { longReflectionTable } from "../api/dom/html-o-list-element-start-property.js";
import { stringReflectionTable } from "../api/dom/html-o-list-element-type-property.js";

export function installHTMLOListElement() {
  installHTMLOListElementConstructor();
  for (const [name, entry] of booleanReflectionPart1Table) definePrototypeAccessor( HTMLOListElement.prototype, name, entry.get, entry.set, );
  for (const [name, entry] of longReflectionTable) definePrototypeAccessor( HTMLOListElement.prototype, name, entry.get, entry.set, );
  for (const [name, entry] of stringReflectionTable) definePrototypeAccessor( HTMLOListElement.prototype, name, entry.get, entry.set, );
  for (const [name, entry] of booleanReflectionPart2Table) definePrototypeAccessor( HTMLOListElement.prototype, name, entry.get, entry.set, );
  defineConstructorBacklink(HTMLOListElement.prototype, HTMLOListElement);
  defineToStringTag(HTMLOListElement.prototype, "HTMLOListElement");
}
