import {
  finishHTMLParagraphElementConstructor,
  installHTMLParagraphElementConstructor,
} from "../api/dom/html-paragraph-element-constructor.js";
import {
  installHTMLParagraphElementAlign,
} from "../api/dom/html-paragraph-element-align-property.js";

export function installHTMLParagraphElement() {
  installHTMLParagraphElementConstructor();
  installHTMLParagraphElementAlign();
  finishHTMLParagraphElementConstructor();
}
