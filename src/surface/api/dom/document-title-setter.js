import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { documentHead } from "./document-record.js";
import { descendants } from "./node-state.js";

export const setTitle = Object.getOwnPropertyDescriptor({
  set title(value) {
    const head = documentHead(this);
    if (head === null) {
      return;
    }
    let titleElement = descendants(head).find(node => node.localName === "title");
    if (titleElement === undefined) {
      titleElement = this.createElement("title");
      head.appendChild(titleElement);
    }
    titleElement.textContent = `${value}`;
  },
}, "title").set;
registerNativeFunction(setTitle, "set title");
