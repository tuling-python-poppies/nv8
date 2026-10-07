import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLLinkElement,
  installHTMLLinkElementConstructor,
} from "../api/dom/html-link-element-constructor.js";
import { crossOrigin, setCrossOrigin } from "../api/dom/html-link-element-cross-origin-property.js";
import { fetchPriority, setFetchPriority } from "../api/dom/html-link-element-fetch-priority-property.js";
import { sheet } from "../api/dom/html-link-element-sheet-getter.js";
import {
  stringReflectionPart1Table,
  stringReflectionPart2Table,
  stringReflectionPart3Table,
  stringReflectionPart4Table,
} from "../api/dom/string-reflection-html-link-element-members.js";
import {
  linkTokenListPropertyPart1Table,
  linkTokenListPropertyPart2Table,
  linkTokenListPropertyPart3Table,
} from "../api/dom/link-token-list-property-members.js";
import { booleanReflectionTable } from "../api/dom/html-link-element-disabled-property.js";
import { urlReflectionTable } from "../api/dom/html-link-element-href-property.js";

export function installHTMLLinkElement() {
  installHTMLLinkElementConstructor();
  for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of urlReflectionTable) accessor(name, entry.get, entry.set);
  accessor("crossOrigin", crossOrigin, setCrossOrigin);
  for (const [name, entry] of stringReflectionPart1Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of linkTokenListPropertyPart1Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionPart2Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of linkTokenListPropertyPart2Table) accessor(name, entry.get, entry.set);
  accessor("fetchPriority", fetchPriority, setFetchPriority);
  for (const [name, entry] of stringReflectionPart3Table) accessor(name, entry.get, entry.set);
  definePrototypeGetter(HTMLLinkElement.prototype, "sheet", sheet);
  for (const [name, entry] of stringReflectionPart4Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of linkTokenListPropertyPart3Table) accessor(name, entry.get, entry.set);
  defineConstructorBacklink(HTMLLinkElement.prototype, HTMLLinkElement);
  defineToStringTag(HTMLLinkElement.prototype, "HTMLLinkElement");
}

function accessor(name, get, set) {
  definePrototypeAccessor(HTMLLinkElement.prototype, name, get, set);
}
