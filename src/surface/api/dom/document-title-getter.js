import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { documentHead } from "./document-record.js";
import { descendants } from "./node-state.js";

export const title = Object.getOwnPropertyDescriptor({
  get title() {
    const head = documentHead(this);
    const titleElement = head === null ? null : descendants(head).find(
      node => node.localName === "title",
    );
    const value = titleElement?.textContent.replace(/\s+/gu, " ").trim() ?? "";
    traceGetter("window.Document.prototype.title", "Document", value);
    return value;
  },
}, "title").get;
registerNativeGetter(title, "title");
