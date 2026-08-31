import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  cite,
  setCite,
} from "../api/dom/html-mod-element-cite-property.js";
import {
  HTMLModElement,
  installHTMLModElementConstructor,
} from "../api/dom/html-mod-element-constructor.js";
import {
  dateTime,
  setDateTime,
} from "../api/dom/html-mod-element-date-time-property.js";

export function installHTMLModElement() {
  installHTMLModElementConstructor();
  definePrototypeAccessor(HTMLModElement.prototype, "cite", cite, setCite);
  definePrototypeAccessor(
    HTMLModElement.prototype,
    "dateTime",
    dateTime,
    setDateTime,
  );
  defineConstructorBacklink(HTMLModElement.prototype, HTMLModElement);
  defineToStringTag(HTMLModElement.prototype, "HTMLModElement");
}
