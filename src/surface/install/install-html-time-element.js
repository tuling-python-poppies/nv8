import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLTimeElement,
  installHTMLTimeElementConstructor,
} from "../api/dom/html-time-element-constructor.js";
import {
  dateTime,
  setDateTime,
} from "../api/dom/html-time-element-date-time-property.js";

export function installHTMLTimeElement() {
  installHTMLTimeElementConstructor();
  definePrototypeAccessor(
    HTMLTimeElement.prototype,
    "dateTime",
    dateTime,
    setDateTime,
  );
  defineConstructorBacklink(HTMLTimeElement.prototype, HTMLTimeElement);
  defineToStringTag(HTMLTimeElement.prototype, "HTMLTimeElement");
}
