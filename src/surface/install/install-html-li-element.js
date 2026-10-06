import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLLIElement,
  installHTMLLIElementConstructor,
} from "../api/dom/html-li-element-constructor.js";
import {
  setType,
  type,
} from "../api/dom/html-li-element-type-property.js";
import { longReflectionTable } from "../api/dom/long-reflection-members.js";

export function installHTMLLIElement() {
  installHTMLLIElementConstructor();for (const [name, entry] of longReflectionTable) definePrototypeAccessor(HTMLLIElement.prototype, name, entry.get, entry.set);
  definePrototypeAccessor(HTMLLIElement.prototype, "type", type, setType);
  defineConstructorBacklink(HTMLLIElement.prototype, HTMLLIElement);
  defineToStringTag(HTMLLIElement.prototype, "HTMLLIElement");
}
