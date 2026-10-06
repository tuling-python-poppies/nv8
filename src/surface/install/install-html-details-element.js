import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLDetailsElement,
  installHTMLDetailsElementConstructor,
} from "../api/dom/html-details-element-constructor.js";
import {
  name,
  setName,
} from "../api/dom/html-details-element-name-property.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";

export function installHTMLDetailsElement() {
  installHTMLDetailsElementConstructor();for (const [name, entry] of booleanReflectionTable) definePrototypeAccessor(HTMLDetailsElement.prototype, name, entry.get, entry.set);
  definePrototypeAccessor(HTMLDetailsElement.prototype, "name", name, setName);
  defineConstructorBacklink(HTMLDetailsElement.prototype, HTMLDetailsElement);
  defineToStringTag(HTMLDetailsElement.prototype, "HTMLDetailsElement");
}
