import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  align,
  setAlign,
} from "../api/dom/html-embed-element-align-property.js";
import {
  HTMLEmbedElement,
  installHTMLEmbedElementConstructor,
} from "../api/dom/html-embed-element-constructor.js";
import {
  getSVGDocument,
} from "../api/dom/html-embed-element-get-svg-document.js";
import {
  height,
  setHeight,
} from "../api/dom/html-embed-element-height-property.js";
import {
  name,
  setName,
} from "../api/dom/html-embed-element-name-property.js";
import {
  setSrc,
  src,
} from "../api/dom/html-embed-element-src-property.js";
import {
  setType,
  type,
} from "../api/dom/html-embed-element-type-property.js";
import {
  setWidth,
  width,
} from "../api/dom/html-embed-element-width-property.js";

export function installHTMLEmbedElement() {
  installHTMLEmbedElementConstructor();
  accessor("src", src, setSrc);
  accessor("type", type, setType);
  accessor("width", width, setWidth);
  accessor("height", height, setHeight);
  accessor("align", align, setAlign);
  accessor("name", name, setName);
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
