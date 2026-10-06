import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLUListElement,
  installHTMLUListElementConstructor,
} from "../api/dom/html-u-list-element-constructor.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";

export function installHTMLUListElement() {
  installHTMLUListElementConstructor();
  for (const [name, entry] of booleanReflectionTable) definePrototypeAccessor( HTMLUListElement.prototype, name, entry.get, entry.set, );
  for (const [name, entry] of stringReflectionTable) definePrototypeAccessor( HTMLUListElement.prototype, name, entry.get, entry.set, );
  defineConstructorBacklink(HTMLUListElement.prototype, HTMLUListElement);
  defineToStringTag(HTMLUListElement.prototype, "HTMLUListElement");
}
