import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  compact,
  setCompact,
} from "../api/dom/html-u-list-element-compact-property.js";
import {
  HTMLUListElement,
  installHTMLUListElementConstructor,
} from "../api/dom/html-u-list-element-constructor.js";
import {
  setType,
  type,
} from "../api/dom/html-u-list-element-type-property.js";

export function installHTMLUListElement() {
  installHTMLUListElementConstructor();
  definePrototypeAccessor(
    HTMLUListElement.prototype,
    "compact",
    compact,
    setCompact,
  );
  definePrototypeAccessor(
    HTMLUListElement.prototype,
    "type",
    type,
    setType,
  );
  defineConstructorBacklink(HTMLUListElement.prototype, HTMLUListElement);
  defineToStringTag(HTMLUListElement.prototype, "HTMLUListElement");
}
