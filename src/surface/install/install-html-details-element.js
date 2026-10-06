import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLDetailsElement,
  installHTMLDetailsElementConstructor,
} from "../api/dom/html-details-element-constructor.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";

export function installHTMLDetailsElement() {
  installHTMLDetailsElementConstructor();for (const [name, entry] of booleanReflectionTable) definePrototypeAccessor(HTMLDetailsElement.prototype, name, entry.get, entry.set);for (const [name, entry] of stringReflectionTable) definePrototypeAccessor(HTMLDetailsElement.prototype, name, entry.get, entry.set);
  defineConstructorBacklink(HTMLDetailsElement.prototype, HTMLDetailsElement);
  defineToStringTag(HTMLDetailsElement.prototype, "HTMLDetailsElement");
}
