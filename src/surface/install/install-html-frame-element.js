import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { contentDocument } from "../api/dom/html-frame-element-content-document-getter.js";
import { contentWindow } from "../api/dom/html-frame-element-content-window-getter.js";
import {
  HTMLFrameElement,
  installHTMLFrameElementConstructor,
} from "../api/dom/html-frame-element-constructor.js";
import { noResize, setNoResize } from "../api/dom/html-frame-element-no-resize-property.js";
import { frameStringPropertyTable } from "../api/dom/frame-string-property-members.js";

export function installHTMLFrameElement() {
  installHTMLFrameElementConstructor();
  for (const [name, entry] of frameStringPropertyTable) accessor(name, entry.get, entry.set);
  accessor("noResize", noResize, setNoResize);
  definePrototypeGetter(HTMLFrameElement.prototype, "contentDocument", contentDocument);
  definePrototypeGetter(HTMLFrameElement.prototype, "contentWindow", contentWindow);
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
