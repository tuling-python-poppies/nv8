import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { HTMLCollection } from "./html-collection-constructor.js";
import { refreshHTMLCollection } from "./html-collection-state.js";

export const namedItem = {
  namedItem(name) {
    const normalized = `${name}`;
    const result = normalized === "" ? null : (
      refreshHTMLCollection(this).find((element) => (
        element.getAttribute("id") === normalized
        || element.getAttribute("name") === normalized
      )) ?? null
    );
    traceCall(
      "window.HTMLCollection.prototype.namedItem",
      "HTMLCollection",
      [name],
      result,
    );
    return result;
  },
}.namedItem;
registerNativeFunction(namedItem, "namedItem");
export function installHTMLCollectionNamedItem() {
  definePrototypeMethod(HTMLCollection.prototype, "namedItem", namedItem);
}
