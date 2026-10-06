import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLSourceElement,
  installHTMLSourceElementConstructor,
} from "../api/dom/html-source-element-constructor.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";
import { unsignedReflectionTable } from "../api/dom/unsigned-reflection-members.js";
import { urlReflectionTable } from "../api/dom/url-reflection-members.js";

export function installHTMLSourceElement() {
  installHTMLSourceElementConstructor();
  for (const [name, entry] of urlReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of unsignedReflectionTable) accessor(name, entry.get, entry.set);
  defineConstructorBacklink(HTMLSourceElement.prototype, HTMLSourceElement);
  defineToStringTag(HTMLSourceElement.prototype, "HTMLSourceElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLSourceElement.prototype, name, getter, setter);
}
