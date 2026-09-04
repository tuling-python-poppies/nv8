import {
  finishHTMLHeadElementConstructor,
  installHTMLHeadElementConstructor,
} from "../api/dom/html-head-element-constructor.js";

export function installHTMLHeadElement() {
  installHTMLHeadElementConstructor();
  finishHTMLHeadElementConstructor();
}
