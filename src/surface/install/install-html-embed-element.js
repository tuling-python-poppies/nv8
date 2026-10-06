import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLEmbedElement,
  installHTMLEmbedElementConstructor,
} from "../api/dom/html-embed-element-constructor.js";
import {
  getSVGDocument,
} from "../api/dom/html-embed-element-get-svg-document.js";
import { stringReflectionTable } from "../api/dom/string-reflection-html-embed-element-members.js";
import { urlReflectionTable } from "../api/dom/html-embed-element-src-property.js";

export function installHTMLEmbedElement() {
  installHTMLEmbedElementConstructor();
  for (const [name, entry] of urlReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  definePrototypeMethod(
    HTMLEmbedElement.prototype,
    "getSVGDocument",
    getSVGDocument,
  );
  defineConstructorBacklink(HTMLEmbedElement.prototype, HTMLEmbedElement);
  defineToStringTag(HTMLEmbedElement.prototype, "HTMLEmbedElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLEmbedElement.prototype, name, getter, setter);
}
