import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  color,
  setColor,
} from "../api/dom/html-font-element-color-property.js";
import {
  face,
  setFace,
} from "../api/dom/html-font-element-face-property.js";
import {
  HTMLFontElement,
  installHTMLFontElementConstructor,
} from "../api/dom/html-font-element-constructor.js";
import {
  setSize,
  size,
} from "../api/dom/html-font-element-size-property.js";

export function installHTMLFontElement() {
  installHTMLFontElementConstructor();
  definePrototypeAccessor(HTMLFontElement.prototype, "color", color, setColor);
  definePrototypeAccessor(HTMLFontElement.prototype, "face", face, setFace);
  definePrototypeAccessor(HTMLFontElement.prototype, "size", size, setSize);
  defineConstructorBacklink(HTMLFontElement.prototype, HTMLFontElement);
  defineToStringTag(HTMLFontElement.prototype, "HTMLFontElement");
}
