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
import { stringReflectionTable } from "../api/dom/string-reflection-html-script-element-members.js";
import { nullableStringReflectionTable } from "../api/dom/html-script-element-cross-origin-property.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-html-script-element-members.js";
import { urlReflectionTable } from "../api/dom/html-script-element-src-property.js";

export function installHTMLScriptElement() {
  installHTMLScriptElementConstructor();
  for (const [name, entry] of urlReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  accessor("async", asyncValue, setAsync);
  for (const [name, entry] of nullableStringReflectionTable) accessor(name, entry.get, entry.set);
  accessor("text", text, setText);
  definePrototypeGetter(HTMLScriptElement.prototype, "blocking", blocking);
  accessor("textContent", textContent, setTextContent);
  accessor("innerText", innerText, setInnerText);
  defineConstructorBacklink(HTMLScriptElement.prototype, HTMLScriptElement);
  defineToStringTag(HTMLScriptElement.prototype, "HTMLScriptElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLScriptElement.prototype, name, getter, setter);
}
