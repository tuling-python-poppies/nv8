import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  compact,
  setCompact,
} from "../api/dom/html-menu-element-compact-property.js";
import {
  HTMLMenuElement,
  installHTMLMenuElementConstructor,
} from "../api/dom/html-menu-element-constructor.js";

export function installHTMLMenuElement() {
  installHTMLMenuElementConstructor();
  definePrototypeAccessor(
    HTMLMenuElement.prototype,
    "compact",
    compact,
    setCompact,
  );
  defineConstructorBacklink(HTMLMenuElement.prototype, HTMLMenuElement);
  defineToStringTag(HTMLMenuElement.prototype, "HTMLMenuElement");
}
