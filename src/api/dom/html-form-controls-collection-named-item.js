import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { refreshHTMLCollection } from "./html-collection-state.js";
import { requireHTMLFormControlsCollection } from "./html-form-controls-collection-state.js";
import { createRadioNodeList } from "./radio-node-list-state.js";

export const namedItem = {
  namedItem(name) {
    const normalized = `${name}`;
    requireHTMLFormControlsCollection(this);
    let result = null;
    if (normalized !== "") {
      const matches = () => refreshHTMLCollection(this).filter(
        control => control.getAttribute("id") === normalized
          || control.getAttribute("name") === normalized,
      );
      const current = matches();
      result = current.length > 1
        ? createRadioNodeList(matches)
        : current[0] ?? null;
    }
    traceCall(
      "window.HTMLFormControlsCollection.prototype.namedItem",
      "HTMLFormControlsCollection",
      [name],
      result,
    );
    return result;
  },
}.namedItem;
registerNativeFunction(namedItem, "namedItem");
