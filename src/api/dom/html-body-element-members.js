import {
  definePrototypeAccessor,
} from "../../webidl/descriptor.js";
import { HTMLBodyElement } from "./html-body-element-constructor.js";
import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
import { htmlStringDescriptor } from "./html-element-property.js";

const stringProperties = [
  "text",
  "link",
  "vLink",
  "aLink",
  "bgColor",
  "background",
];
const eventProperties = [
  "onblur",
  "onerror",
  "onfocus",
  "onload",
  "onresize",
  "onscroll",
  "onafterprint",
  "onbeforeprint",
  "onbeforeunload",
  "onhashchange",
  "onlanguagechange",
  "onmessage",
  "onmessageerror",
  "onoffline",
  "ononline",
  "onpagehide",
  "onpageshow",
  "onpopstate",
  "onrejectionhandled",
  "onstorage",
  "onunhandledrejection",
  "onunload",
  "ongamepadconnected",
  "ongamepaddisconnected",
];

export function installHTMLBodyElementMembers() {
  for (const name of stringProperties) {
    const descriptor = htmlStringDescriptor(name);
    definePrototypeAccessor(
      HTMLBodyElement.prototype,
      name,
      descriptor.get,
      descriptor.set,
    );
  }
  for (const name of eventProperties) {
    const descriptor = htmlElementHandlerDescriptor(name);
    definePrototypeAccessor(
      HTMLBodyElement.prototype,
      name,
      descriptor.get,
      descriptor.set,
    );
  }
}
