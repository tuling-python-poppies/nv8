import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLDirectoryElement,
  installHTMLDirectoryElementConstructor,
} from "../api/dom/html-directory-element-constructor.js";
import { booleanReflectionTable } from "../api/dom/html-directory-element-compact-property.js";

export function installHTMLDirectoryElement() {
  installHTMLDirectoryElementConstructor();
  for (const [name, entry] of booleanReflectionTable) definePrototypeAccessor( HTMLDirectoryElement.prototype, name, entry.get, entry.set, );
  defineConstructorBacklink(
    HTMLDirectoryElement.prototype,
    HTMLDirectoryElement,
  );
  defineToStringTag(HTMLDirectoryElement.prototype, "HTMLDirectoryElement");
}
