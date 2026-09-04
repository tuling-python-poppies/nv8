import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLDetailsElement,
  installHTMLDetailsElementConstructor,
} from "../api/dom/html-details-element-constructor.js";
import {
  name,
  setName,
} from "../api/dom/html-details-element-name-property.js";
import {
  open,
  setOpen,
} from "../api/dom/html-details-element-open-property.js";

export function installHTMLDetailsElement() {
  installHTMLDetailsElementConstructor();
  definePrototypeAccessor(HTMLDetailsElement.prototype, "open", open, setOpen);
  definePrototypeAccessor(HTMLDetailsElement.prototype, "name", name, setName);
  defineConstructorBacklink(HTMLDetailsElement.prototype, HTMLDetailsElement);
  defineToStringTag(HTMLDetailsElement.prototype, "HTMLDetailsElement");
}
