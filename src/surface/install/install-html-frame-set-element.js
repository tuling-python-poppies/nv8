import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLFrameSetElement,
  installHTMLFrameSetElementConstructor,
} from "../api/dom/html-frame-set-element-constructor.js";
import { stringReflectionTable } from "../api/dom/string-reflection-html-frame-set-element-members.js";
import {
  frameSetHandlerPropertyPart1Table,
  frameSetHandlerPropertyPart2Table,
} from "../api/dom/frame-set-handler-property-members.js";

export function installHTMLFrameSetElement() {
  installHTMLFrameSetElementConstructor();
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of frameSetHandlerPropertyPart1Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of frameSetHandlerPropertyPart2Table) accessor( name, entry.get, entry.set, );
  defineConstructorBacklink(HTMLFrameSetElement.prototype, HTMLFrameSetElement);
  defineToStringTag(HTMLFrameSetElement.prototype, "HTMLFrameSetElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLFrameSetElement.prototype, name, getter, setter);
}
