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
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";
import { nullableStringReflectionTable } from "../api/dom/nullable-string-reflection-members.js";
import { unsignedReflectionTable } from "../api/dom/unsigned-reflection-members.js";
import { urlReflectionTable } from "../api/dom/url-reflection-members.js";

export function installHTMLImageElement() {
  installHTMLImageElementConstructor();
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of urlReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of nullableStringReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of unsignedReflectionTable) accessor(name, entry.get, entry.set);
  getter("naturalWidth", naturalWidth);
  getter("naturalHeight", naturalHeight);
  getter("complete", complete);
  getter("currentSrc", currentSrc);
  getter("x", x);
  getter("y", y);
  definePrototypeMethod(HTMLImageElement.prototype, "decode", decode);
  defineConstructorBacklink(HTMLImageElement.prototype, HTMLImageElement);
  defineToStringTag(HTMLImageElement.prototype, "HTMLImageElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLImageElement.prototype, name, getter, setter);
}

function getter(name, callback) {
  definePrototypeGetter(HTMLImageElement.prototype, name, callback);
}
