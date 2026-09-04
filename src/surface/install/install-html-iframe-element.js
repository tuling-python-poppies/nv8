import {
  installHTMLIFrameElementFactory,
} from "../api/dom/html-iframe-element-constructor.js";
import {
  installHTMLIFrameElementMembers,
} from "../api/dom/html-iframe-element-members.js";

export function installHTMLIFrameElement() {
  installHTMLIFrameElementFactory();
  installHTMLIFrameElementMembers();
}
