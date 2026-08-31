import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { contentDocument } from "../api/dom/html-frame-element-content-document-getter.js";
import { contentWindow } from "../api/dom/html-frame-element-content-window-getter.js";
import {
  HTMLFrameElement,
  installHTMLFrameElementConstructor,
} from "../api/dom/html-frame-element-constructor.js";
import { frameBorder, setFrameBorder } from "../api/dom/html-frame-element-frame-border-property.js";
import { longDesc, setLongDesc } from "../api/dom/html-frame-element-long-desc-property.js";
import { marginHeight, setMarginHeight } from "../api/dom/html-frame-element-margin-height-property.js";
import { marginWidth, setMarginWidth } from "../api/dom/html-frame-element-margin-width-property.js";
import { name, setName } from "../api/dom/html-frame-element-name-property.js";
import { noResize, setNoResize } from "../api/dom/html-frame-element-no-resize-property.js";
import { scrolling, setScrolling } from "../api/dom/html-frame-element-scrolling-property.js";
import { src, setSrc } from "../api/dom/html-frame-element-src-property.js";

export function installHTMLFrameElement() {
  installHTMLFrameElementConstructor();
  accessor("name", name, setName);
  accessor("scrolling", scrolling, setScrolling);
  accessor("src", src, setSrc);
  accessor("frameBorder", frameBorder, setFrameBorder);
  accessor("longDesc", longDesc, setLongDesc);
  accessor("noResize", noResize, setNoResize);
  definePrototypeGetter(HTMLFrameElement.prototype, "contentDocument", contentDocument);
  definePrototypeGetter(HTMLFrameElement.prototype, "contentWindow", contentWindow);
  accessor("marginHeight", marginHeight, setMarginHeight);
  accessor("marginWidth", marginWidth, setMarginWidth);
  defineConstructorBacklink(HTMLFrameElement.prototype, HTMLFrameElement);
  defineToStringTag(HTMLFrameElement.prototype, "HTMLFrameElement");
}

function accessor(propertyName, getter, setter) {
  definePrototypeAccessor(
    HTMLFrameElement.prototype,
    propertyName,
    getter,
    setter,
  );
}
