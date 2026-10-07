import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  asyncValue,
  setAsync,
} from "../api/dom/html-script-element-async-property.js";
import {
  blocking,
} from "../api/dom/html-script-element-blocking-getter.js";
import {
  HTMLScriptElement,
  installHTMLScriptElementConstructor,
} from "../api/dom/html-script-element-constructor.js";
import {
  innerText,
  setInnerText,
} from "../api/dom/html-script-element-inner-text-property.js";
import {
  textContent,
  setTextContent,
} from "../api/dom/html-script-element-text-content-property.js";
import {
  text,
  setText,
} from "../api/dom/html-script-element-text-property.js";
import {
  stringReflectionPart1Table,
  stringReflectionPart2Table,
  stringReflectionPart3Table,
  stringReflectionPart4Table,
} from "../api/dom/string-reflection-html-script-element-members.js";
import { nullableStringReflectionTable } from "../api/dom/html-script-element-cross-origin-property.js";
import {
  booleanReflectionPart1Table,
  booleanReflectionPart2Table,
} from "../api/dom/boolean-reflection-html-script-element-members.js";
import { urlReflectionTable } from "../api/dom/html-script-element-src-property.js";

export function installHTMLScriptElement() {
  installHTMLScriptElementConstructor();
  for (const [name, entry] of urlReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionPart1Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of booleanReflectionPart1Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionPart2Table) accessor(name, entry.get, entry.set);
  accessor("async", asyncValue, setAsync);
  for (const [name, entry] of booleanReflectionPart2Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of nullableStringReflectionTable) accessor(name, entry.get, entry.set);
  accessor("text", text, setText);
  for (const [name, entry] of stringReflectionPart3Table) accessor(name, entry.get, entry.set);
  definePrototypeGetter(HTMLScriptElement.prototype, "blocking", blocking);
  accessor("textContent", textContent, setTextContent);
  accessor("innerText", innerText, setInnerText);
  defineConstructorBacklink(HTMLScriptElement.prototype, HTMLScriptElement);
  for (const [name, entry] of stringReflectionPart4Table) accessor(name, entry.get, entry.set);
  defineToStringTag(HTMLScriptElement.prototype, "HTMLScriptElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLScriptElement.prototype, name, getter, setter);
}
