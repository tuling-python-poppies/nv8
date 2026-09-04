import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  blocking,
} from "../api/dom/html-style-element-blocking-getter.js";
import {
  HTMLStyleElement,
  installHTMLStyleElementConstructor,
} from "../api/dom/html-style-element-constructor.js";
import {
  disabled,
  setDisabled,
} from "../api/dom/html-style-element-disabled-property.js";
import {
  media,
  setMedia,
} from "../api/dom/html-style-element-media-property.js";
import {
  sheet,
} from "../api/dom/html-style-element-sheet-getter.js";
import {
  setType,
  type,
} from "../api/dom/html-style-element-type-property.js";

export function installHTMLStyleElement() {
  installHTMLStyleElementConstructor();
  definePrototypeAccessor(
    HTMLStyleElement.prototype,
    "disabled",
    disabled,
    setDisabled,
  );
  definePrototypeAccessor(
    HTMLStyleElement.prototype,
    "media",
    media,
    setMedia,
  );
  definePrototypeAccessor(HTMLStyleElement.prototype, "type", type, setType);
  definePrototypeGetter(HTMLStyleElement.prototype, "sheet", sheet);
  definePrototypeGetter(HTMLStyleElement.prototype, "blocking", blocking);
  defineConstructorBacklink(HTMLStyleElement.prototype, HTMLStyleElement);
  defineToStringTag(HTMLStyleElement.prototype, "HTMLStyleElement");
}
