import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { cols, setCols } from "../api/dom/html-frame-set-element-cols-property.js";
import {
  HTMLFrameSetElement,
  installHTMLFrameSetElementConstructor,
} from "../api/dom/html-frame-set-element-constructor.js";
import { rows, setRows } from "../api/dom/html-frame-set-element-rows-property.js";
import { frameSetHandlerPropertyTable } from "../api/dom/frame-set-handler-property-members.js";

export function installHTMLFrameSetElement() {
  installHTMLFrameSetElementConstructor();
  accessor("cols", cols, setCols);
  accessor("rows", rows, setRows);for (const [name, entry] of frameSetHandlerPropertyTable) accessor(name, entry.get, entry.set);for (const [name, entry] of frameSetHandlerPropertyTable) accessor( name, entry.get, entry.set, );
  defineConstructorBacklink(HTMLFrameSetElement.prototype, HTMLFrameSetElement);
  defineToStringTag(HTMLFrameSetElement.prototype, "HTMLFrameSetElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLFrameSetElement.prototype, name, getter, setter);
}
