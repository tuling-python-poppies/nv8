import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  align,
  setAlign,
} from "../api/dom/html-table-col-element-align-property.js";
import {
  ch,
  setCh,
} from "../api/dom/html-table-col-element-ch-property.js";
import {
  chOff,
  setChOff,
} from "../api/dom/html-table-col-element-ch-off-property.js";
import {
  HTMLTableColElement,
  installHTMLTableColElementConstructor,
} from "../api/dom/html-table-col-element-constructor.js";
import {
  setSpan,
  span,
} from "../api/dom/html-table-col-element-span-property.js";
import {
  setVAlign,
  vAlign,
} from "../api/dom/html-table-col-element-v-align-property.js";
import {
  setWidth,
  width,
} from "../api/dom/html-table-col-element-width-property.js";

export function installHTMLTableColElement() {
  installHTMLTableColElementConstructor();
  accessor("span", span, setSpan);
  accessor("align", align, setAlign);
  accessor("ch", ch, setCh);
  accessor("chOff", chOff, setChOff);
  accessor("vAlign", vAlign, setVAlign);
  accessor("width", width, setWidth);
  defineConstructorBacklink(HTMLTableColElement.prototype, HTMLTableColElement);
  defineToStringTag(HTMLTableColElement.prototype, "HTMLTableColElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLTableColElement.prototype, name, getter, setter);
}
