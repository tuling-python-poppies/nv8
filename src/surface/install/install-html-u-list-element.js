import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLUListElement,
  installHTMLUListElementConstructor,
} from "../api/dom/html-u-list-element-constructor.js";
import {
  setType,
  type,
} from "../api/dom/html-u-list-element-type-property.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";

export function installHTMLUListElement() {
  installHTMLUListElementConstructor();for (const [name, entry] of booleanReflectionTable) definePrototypeAccessor( HTMLUListElement.prototype, name, entry.get, entry.set, );
  definePrototypeAccessor(
    HTMLUListElement.prototype,
    "type",
    type,
    setType,
  );
  defineConstructorBacklink(HTMLUListElement.prototype, HTMLUListElement);
  defineToStringTag(HTMLUListElement.prototype, "HTMLUListElement");
}
