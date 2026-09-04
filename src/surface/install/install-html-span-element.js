import {
  finishHTMLSpanElementConstructor,
  installHTMLSpanElementConstructor,
} from "../api/dom/html-span-element-constructor.js";

export function installHTMLSpanElement() {
  installHTMLSpanElementConstructor();
  finishHTMLSpanElementConstructor();
}
