import {
  finishHTMLUnknownElementConstructor,
  installHTMLUnknownElementConstructor,
} from "../api/dom/html-unknown-element-constructor.js";

export function installHTMLUnknownElement() {
  installHTMLUnknownElementConstructor();
  finishHTMLUnknownElementConstructor();
}
