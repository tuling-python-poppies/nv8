import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  compact,
  setCompact,
} from "../api/dom/html-o-list-element-compact-property.js";
import {
  HTMLOListElement,
  installHTMLOListElementConstructor,
} from "../api/dom/html-o-list-element-constructor.js";
import {
  reversed,
  setReversed,
} from "../api/dom/html-o-list-element-reversed-property.js";
import {
  setStart,
  start,
} from "../api/dom/html-o-list-element-start-property.js";
import {
  setType,
  type,
} from "../api/dom/html-o-list-element-type-property.js";

export function installHTMLOListElement() {
  installHTMLOListElementConstructor();
  definePrototypeAccessor(
    HTMLOListElement.prototype,
    "reversed",
    reversed,
    setReversed,
  );
  definePrototypeAccessor(
    HTMLOListElement.prototype,
    "start",
    start,
    setStart,
  );
  definePrototypeAccessor(
    HTMLOListElement.prototype,
    "type",
    type,
    setType,
  );
  definePrototypeAccessor(
    HTMLOListElement.prototype,
    "compact",
    compact,
    setCompact,
  );
  defineConstructorBacklink(HTMLOListElement.prototype, HTMLOListElement);
  defineToStringTag(HTMLOListElement.prototype, "HTMLOListElement");
}
