import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  compact,
  setCompact,
} from "../api/dom/html-directory-element-compact-property.js";
import {
  HTMLDirectoryElement,
  installHTMLDirectoryElementConstructor,
} from "../api/dom/html-directory-element-constructor.js";

export function installHTMLDirectoryElement() {
  installHTMLDirectoryElementConstructor();
  definePrototypeAccessor(
    HTMLDirectoryElement.prototype,
    "compact",
    compact,
    setCompact,
  );
  defineConstructorBacklink(
    HTMLDirectoryElement.prototype,
    HTMLDirectoryElement,
  );
  defineToStringTag(HTMLDirectoryElement.prototype, "HTMLDirectoryElement");
}
