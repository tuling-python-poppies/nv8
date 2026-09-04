import {
  finishHTMLDivElementConstructor,
  installHTMLDivElementConstructor,
} from "../api/dom/html-div-element-constructor.js";
import {
  installHTMLDivElementAlign,
} from "../api/dom/html-div-element-align-property.js";

export function installHTMLDivElement() {
  installHTMLDivElementConstructor();
  installHTMLDivElementAlign();
  finishHTMLDivElementConstructor();
}
