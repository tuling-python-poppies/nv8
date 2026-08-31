import {
  finishHTMLBodyElementConstructor,
  installHTMLBodyElementConstructor,
} from "../api/dom/html-body-element-constructor.js";
import {
  installHTMLBodyElementMembers,
} from "../api/dom/html-body-element-members.js";

export function installHTMLBodyElement() {
  installHTMLBodyElementConstructor();
  installHTMLBodyElementMembers();
  finishHTMLBodyElementConstructor();
}
