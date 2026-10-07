import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLAreaElement,
  installHTMLAreaElementConstructor,
} from "../api/dom/html-area-element-constructor.js";
import { interestForElement, setInterestForElement } from "../api/dom/html-area-element-interest-for-element-property.js";
import { origin } from "../api/dom/html-area-element-origin-getter.js";
import { relList, setRelList } from "../api/dom/html-area-element-rel-list-property.js";
import { toString } from "../api/dom/html-area-element-to-string.js";
import {
  stringReflectionPart1Table,
  stringReflectionPart2Table,
  stringReflectionPart3Table,
} from "../api/dom/string-reflection-html-area-element-members.js";
import { areaURLComponentPropertyTable } from "../api/dom/area-urlcomponent-property-members.js";
import { urlReflectionTable } from "../api/dom/html-area-element-href-property.js";
import { booleanReflectionTable } from "../api/dom/html-area-element-no-href-property.js";

export function installHTMLAreaElement() {
  installHTMLAreaElementConstructor();
  for (const [name, entry] of stringReflectionPart1Table) accessor(name, entry.get, entry.set);
  accessor("relList", relList, setRelList);
  for (const [name, entry] of stringReflectionPart2Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  definePrototypeGetter(HTMLAreaElement.prototype, "origin", origin);
  for (const [name, entry] of areaURLComponentPropertyTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of urlReflectionTable) accessor(name, entry.get, entry.set);
  accessor("interestForElement", interestForElement, setInterestForElement);
  definePrototypeMethod(HTMLAreaElement.prototype, "toString", toString);
  defineConstructorBacklink(HTMLAreaElement.prototype, HTMLAreaElement);
  for (const [name, entry] of stringReflectionPart3Table) accessor(name, entry.get, entry.set);
  defineToStringTag(HTMLAreaElement.prototype, "HTMLAreaElement");
}

function accessor(name, get, set) {
  definePrototypeAccessor(HTMLAreaElement.prototype, name, get, set);
}
