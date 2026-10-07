import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { complete } from "../api/dom/html-image-element-complete-getter.js";
import { currentSrc } from "../api/dom/html-image-element-current-src-getter.js";
import { decode } from "../api/dom/html-image-element-decode.js";
import {
  HTMLImageElement,
  installHTMLImageElementConstructor,
} from "../api/dom/html-image-element-constructor.js";
import { naturalHeight } from "../api/dom/html-image-element-natural-height-getter.js";
import { naturalWidth } from "../api/dom/html-image-element-natural-width-getter.js";
import { x } from "../api/dom/html-image-element-x-getter.js";
import { y } from "../api/dom/html-image-element-y-getter.js";
import {
  stringReflectionPart1Table,
  stringReflectionPart2Table,
  stringReflectionPart3Table,
  stringReflectionPart4Table,
  stringReflectionPart5Table,
  stringReflectionPart6Table,
  stringReflectionPart7Table,
} from "../api/dom/string-reflection-html-image-element-members.js";
import {
  booleanReflectionPart1Table,
  booleanReflectionPart2Table,
  booleanReflectionPart3Table,
} from "../api/dom/boolean-reflection-html-image-element-members.js";
import { nullableStringReflectionTable } from "../api/dom/html-image-element-cross-origin-property.js";
import {
  unsignedReflectionPart1Table,
  unsignedReflectionPart2Table,
} from "../api/dom/unsigned-reflection-html-image-element-members.js";
import {
  urlReflectionPart1Table,
  urlReflectionPart2Table,
  urlReflectionPart3Table,
} from "../api/dom/url-reflection-html-image-element-members.js";

export function installHTMLImageElement() {
  installHTMLImageElementConstructor();
  for (const [name, entry] of stringReflectionPart1Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of urlReflectionPart1Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionPart2Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of nullableStringReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionPart3Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of booleanReflectionPart1Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of unsignedReflectionPart1Table) accessor(name, entry.get, entry.set);
  getter("naturalWidth", naturalWidth);
  getter("naturalHeight", naturalHeight);
  getter("complete", complete);
  getter("currentSrc", currentSrc);
  for (const [name, entry] of stringReflectionPart4Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of urlReflectionPart2Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionPart5Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of unsignedReflectionPart2Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of urlReflectionPart3Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionPart6Table) accessor(name, entry.get, entry.set);
  getter("x", x);
  getter("y", y);
  definePrototypeMethod(HTMLImageElement.prototype, "decode", decode);
  defineConstructorBacklink(HTMLImageElement.prototype, HTMLImageElement);
  for (const [name, entry] of booleanReflectionPart2Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionPart7Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of booleanReflectionPart3Table) accessor( name, entry.get, entry.set, );
  defineToStringTag(HTMLImageElement.prototype, "HTMLImageElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLImageElement.prototype, name, getter, setter);
}

function getter(name, callback) {
  definePrototypeGetter(HTMLImageElement.prototype, name, callback);
}
