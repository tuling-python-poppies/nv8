import {
  finishHTMLHeadingElementConstructor,
  installHTMLHeadingElementConstructor,
} from "../api/dom/html-heading-element-constructor.js";
import {
  installHTMLHeadingElementAlign,
} from "../api/dom/html-heading-element-align-property.js";

export function installHTMLHeadingElement() {
  installHTMLHeadingElementConstructor();
  installHTMLHeadingElementAlign();
  finishHTMLHeadingElementConstructor();
}
