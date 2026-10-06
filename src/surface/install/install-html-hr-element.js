import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  align,
  setAlign,
} from "../api/dom/html-hr-element-align-property.js";
import {
  color,
  setColor,
} from "../api/dom/html-hr-element-color-property.js";
import {
  HTMLHRElement,
  installHTMLHRElementConstructor,
} from "../api/dom/html-hr-element-constructor.js";
import {
  setSize,
  size,
} from "../api/dom/html-hr-element-size-property.js";
import {
  setWidth,
  width,
} from "../api/dom/html-hr-element-width-property.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";

export function installHTMLHRElement() {
  installHTMLHRElementConstructor();
  definePrototypeAccessor(HTMLHRElement.prototype, "align", align, setAlign);
  definePrototypeAccessor(HTMLHRElement.prototype, "color", color, setColor);for (const [name, entry] of booleanReflectionTable) definePrototypeAccessor( HTMLHRElement.prototype, name, entry.get, entry.set, );
  definePrototypeAccessor(HTMLHRElement.prototype, "size", size, setSize);
  definePrototypeAccessor(HTMLHRElement.prototype, "width", width, setWidth);
  defineConstructorBacklink(HTMLHRElement.prototype, HTMLHRElement);
  defineToStringTag(HTMLHRElement.prototype, "HTMLHRElement");
}
