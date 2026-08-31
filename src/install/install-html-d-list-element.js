import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  compact,
  setCompact,
} from "../api/dom/html-d-list-element-compact-property.js";
import {
  HTMLDListElement,
  installHTMLDListElementConstructor,
} from "../api/dom/html-d-list-element-constructor.js";

export function installHTMLDListElement() {
  installHTMLDListElementConstructor();
  definePrototypeAccessor(
    HTMLDListElement.prototype,
    "compact",
    compact,
    setCompact,
  );
  defineConstructorBacklink(HTMLDListElement.prototype, HTMLDListElement);
  defineToStringTag(HTMLDListElement.prototype, "HTMLDListElement");
}
