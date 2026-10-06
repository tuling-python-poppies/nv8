import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLFrameSetElement,
  installHTMLFrameSetElementConstructor,
} from "../api/dom/html-frame-set-element-constructor.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";
import { frameSetHandlerPropertyTable } from "../api/dom/frame-set-handler-property-members.js";

export function installHTMLFrameSetElement() {
  installHTMLFrameSetElementConstructor();
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of frameSetHandlerPropertyTable) accessor(name, entry.get, entry.set);
  defineConstructorBacklink(HTMLFrameSetElement.prototype, HTMLFrameSetElement);
  defineToStringTag(HTMLFrameSetElement.prototype, "HTMLFrameSetElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLFrameSetElement.prototype, name, getter, setter);
}
