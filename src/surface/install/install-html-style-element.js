import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  blocking,
} from "../api/dom/html-style-element-blocking-getter.js";
import {
  HTMLStyleElement,
  installHTMLStyleElementConstructor,
} from "../api/dom/html-style-element-constructor.js";
import {
  disabled,
  setDisabled,
} from "../api/dom/html-style-element-disabled-property.js";
import {
  sheet,
} from "../api/dom/html-style-element-sheet-getter.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";

export function installHTMLStyleElement() {
  installHTMLStyleElementConstructor();
  definePrototypeAccessor(
    HTMLStyleElement.prototype,
    "disabled",
    disabled,
    setDisabled,
  );for (const [name, entry] of stringReflectionTable) definePrototypeAccessor( HTMLStyleElement.prototype, name, entry.get, entry.set, );for (const [name, entry] of stringReflectionTable) definePrototypeAccessor(HTMLStyleElement.prototype, name, entry.get, entry.set);
  definePrototypeGetter(HTMLStyleElement.prototype, "sheet", sheet);
  definePrototypeGetter(HTMLStyleElement.prototype, "blocking", blocking);
  defineConstructorBacklink(HTMLStyleElement.prototype, HTMLStyleElement);
  defineToStringTag(HTMLStyleElement.prototype, "HTMLStyleElement");
}
