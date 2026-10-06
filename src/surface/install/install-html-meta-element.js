import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLMetaElement,
  installHTMLMetaElementConstructor,
} from "../api/dom/html-meta-element-constructor.js";
import { stringReflectionTable } from "../api/dom/string-reflection-html-meta-element-members.js";

export function installHTMLMetaElement() {
  installHTMLMetaElementConstructor();
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  defineConstructorBacklink(HTMLMetaElement.prototype, HTMLMetaElement);
  defineToStringTag(HTMLMetaElement.prototype, "HTMLMetaElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLMetaElement.prototype, name, getter, setter);
}
