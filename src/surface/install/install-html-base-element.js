import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLBaseElement,
  installHTMLBaseElementConstructor,
} from "../api/dom/html-base-element-constructor.js";
import {
  href,
  setHref,
} from "../api/dom/html-base-element-href-property.js";
import {
  setTarget,
  target,
} from "../api/dom/html-base-element-target-property.js";

export function installHTMLBaseElement() {
  installHTMLBaseElementConstructor();
  definePrototypeAccessor(HTMLBaseElement.prototype, "href", href, setHref);
  definePrototypeAccessor(
    HTMLBaseElement.prototype,
    "target",
    target,
    setTarget,
  );
  defineConstructorBacklink(HTMLBaseElement.prototype, HTMLBaseElement);
  defineToStringTag(HTMLBaseElement.prototype, "HTMLBaseElement");
}
