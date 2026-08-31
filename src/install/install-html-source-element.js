import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  height,
  setHeight,
} from "../api/dom/html-source-element-height-property.js";
import {
  media,
  setMedia,
} from "../api/dom/html-source-element-media-property.js";
import {
  setSizes,
  sizes,
} from "../api/dom/html-source-element-sizes-property.js";
import {
  HTMLSourceElement,
  installHTMLSourceElementConstructor,
} from "../api/dom/html-source-element-constructor.js";
import {
  setSrc,
  src,
} from "../api/dom/html-source-element-src-property.js";
import {
  setSrcset,
  srcset,
} from "../api/dom/html-source-element-srcset-property.js";
import {
  setType,
  type,
} from "../api/dom/html-source-element-type-property.js";
import {
  setWidth,
  width,
} from "../api/dom/html-source-element-width-property.js";

export function installHTMLSourceElement() {
  installHTMLSourceElementConstructor();
  accessor("src", src, setSrc);
  accessor("type", type, setType);
  accessor("srcset", srcset, setSrcset);
  accessor("sizes", sizes, setSizes);
  accessor("media", media, setMedia);
  accessor("width", width, setWidth);
  accessor("height", height, setHeight);
  defineConstructorBacklink(HTMLSourceElement.prototype, HTMLSourceElement);
  defineToStringTag(HTMLSourceElement.prototype, "HTMLSourceElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLSourceElement.prototype, name, getter, setter);
}
