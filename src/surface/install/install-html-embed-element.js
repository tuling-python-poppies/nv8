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
import {
  setSrc,
  src,
} from "../api/dom/html-embed-element-src-property.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";

export function installHTMLEmbedElement() {
  installHTMLEmbedElementConstructor();
  accessor("src", src, setSrc);for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
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
