import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { allow, setAllow } from "../api/dom/html-fenced-frame-element-allow-property.js";
import { canLoadOpaqueURL } from "../api/dom/html-fenced-frame-element-can-load-opaque-url.js";
import { config, setConfig } from "../api/dom/html-fenced-frame-element-config-property.js";
import {
  HTMLFencedFrameElement,
  installHTMLFencedFrameElementConstructor,
} from "../api/dom/html-fenced-frame-element-constructor.js";
import { height, setHeight } from "../api/dom/html-fenced-frame-element-height-property.js";
import { sandbox, setSandbox } from "../api/dom/html-fenced-frame-element-sandbox-property.js";
import { width, setWidth } from "../api/dom/html-fenced-frame-element-width-property.js";

export function installHTMLFencedFrameElement() {
  installHTMLFencedFrameElementConstructor();
  definePrototypeAccessor(HTMLFencedFrameElement.prototype, "width", width, setWidth);
  definePrototypeAccessor(HTMLFencedFrameElement.prototype, "height", height, setHeight);
  definePrototypeAccessor(HTMLFencedFrameElement.prototype, "sandbox", sandbox, setSandbox);
  definePrototypeAccessor(HTMLFencedFrameElement.prototype, "config", config, setConfig);
  definePrototypeAccessor(HTMLFencedFrameElement.prototype, "allow", allow, setAllow);
  defineConstructorBacklink(HTMLFencedFrameElement.prototype, HTMLFencedFrameElement);
  defineToStringTag(HTMLFencedFrameElement.prototype, "HTMLFencedFrameElement");
  definePrototypeMethod(
    HTMLFencedFrameElement,
    "canLoadOpaqueURL",
    canLoadOpaqueURL,
  );
}
