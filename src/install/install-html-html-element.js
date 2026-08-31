import {
  finishHTMLHtmlElementConstructor,
  installHTMLHtmlElementConstructor,
} from "../api/dom/html-html-element-constructor.js";
import {
  installHTMLHtmlElementVersion,
} from "../api/dom/html-html-element-version-property.js";

export function installHTMLHtmlElement() {
  installHTMLHtmlElementConstructor();
  installHTMLHtmlElementVersion();
  finishHTMLHtmlElementConstructor();
}
