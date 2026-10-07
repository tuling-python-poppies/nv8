import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLAnchorElement,
  installHTMLAnchorElementConstructor,
} from "../api/dom/html-anchor-element-constructor.js";
import {
  interestForElement,
  setInterestForElement,
} from "../api/dom/html-anchor-element-interest-for-element-property.js";
import { origin } from "../api/dom/html-anchor-element-origin-getter.js";
import {
  relList,
} from "../api/dom/html-anchor-element-rel-list-getter.js";
import {
  text,
  setText,
} from "../api/dom/html-anchor-element-text-property.js";
import { toString } from "../api/dom/html-anchor-element-to-string.js";
import {
  stringReflectionPart1Table,
  stringReflectionPart2Table,
  stringReflectionPart3Table,
  stringReflectionPart4Table,
} from "../api/dom/string-reflection-html-anchor-element-members.js";
import { anchorURLComponentPropertyTable } from "../api/dom/anchor-urlcomponent-property-members.js";
import { urlReflectionTable } from "../api/dom/html-anchor-element-href-property.js";

export function installHTMLAnchorElement() {
  installHTMLAnchorElementConstructor();
  for (const [name, entry] of stringReflectionPart1Table) accessor(name, entry.get, entry.set);
  definePrototypeGetter(HTMLAnchorElement.prototype, "relList", relList);
  for (const [name, entry] of stringReflectionPart2Table) accessor(name, entry.get, entry.set);
  accessor("text", text, setText);
  for (const [name, entry] of stringReflectionPart3Table) accessor(name, entry.get, entry.set);
  definePrototypeGetter(HTMLAnchorElement.prototype, "origin", origin);
  for (const [name, entry] of anchorURLComponentPropertyTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of urlReflectionTable) accessor(name, entry.get, entry.set);
  accessor(
    "interestForElement",
    interestForElement,
    setInterestForElement,
  );
  definePrototypeMethod(HTMLAnchorElement.prototype, "toString", toString);
  defineConstructorBacklink(
    HTMLAnchorElement.prototype,
    HTMLAnchorElement,
  );
  for (const [name, entry] of stringReflectionPart4Table) accessor(name, entry.get, entry.set);
  defineToStringTag(HTMLAnchorElement.prototype, "HTMLAnchorElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(
    HTMLAnchorElement.prototype,
    name,
    getter,
    setter,
  );
}
