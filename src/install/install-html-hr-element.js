import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../webidl/descriptor.js";
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
  noShade,
  setNoShade,
} from "../api/dom/html-hr-element-no-shade-property.js";
import {
  setSize,
  size,
} from "../api/dom/html-hr-element-size-property.js";
import {
  setWidth,
  width,
} from "../api/dom/html-hr-element-width-property.js";

export function installHTMLHRElement() {
  installHTMLHRElementConstructor();
  definePrototypeAccessor(HTMLHRElement.prototype, "align", align, setAlign);
  definePrototypeAccessor(HTMLHRElement.prototype, "color", color, setColor);
  definePrototypeAccessor(
    HTMLHRElement.prototype,
    "noShade",
    noShade,
    setNoShade,
  );
  definePrototypeAccessor(HTMLHRElement.prototype, "size", size, setSize);
  definePrototypeAccessor(HTMLHRElement.prototype, "width", width, setWidth);
  defineConstructorBacklink(HTMLHRElement.prototype, HTMLHRElement);
  defineToStringTag(HTMLHRElement.prototype, "HTMLHRElement");
}
