import {
  finishHTMLPreElementConstructor,
  installHTMLPreElementConstructor,
} from "../api/dom/html-pre-element-constructor.js";
import {
  installHTMLPreElementWidth,
} from "../api/dom/html-pre-element-width-property.js";

export function installHTMLPreElement() {
  installHTMLPreElementConstructor();
  installHTMLPreElementWidth();
  finishHTMLPreElementConstructor();
}
