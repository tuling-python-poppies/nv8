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
  setType,
  type,
} from "../api/dom/html-o-list-element-type-property.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";
import { longReflectionTable } from "../api/dom/long-reflection-members.js";

export function installHTMLOListElement() {
  installHTMLOListElementConstructor();for (const [name, entry] of booleanReflectionTable) definePrototypeAccessor( HTMLOListElement.prototype, name, entry.get, entry.set, );for (const [name, entry] of longReflectionTable) definePrototypeAccessor( HTMLOListElement.prototype, name, entry.get, entry.set, );
  definePrototypeAccessor(
    HTMLOListElement.prototype,
    "type",
    type,
    setType,
  );for (const [name, entry] of booleanReflectionTable) definePrototypeAccessor( HTMLOListElement.prototype, name, entry.get, entry.set, );
  defineConstructorBacklink(HTMLOListElement.prototype, HTMLOListElement);
  defineToStringTag(HTMLOListElement.prototype, "HTMLOListElement");
}
