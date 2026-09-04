import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { HTMLCollection } from "./html-collection-constructor.js";
import { refreshHTMLCollection } from "./html-collection-state.js";

export const item = {
  item(index) {
    const result = refreshHTMLCollection(this)[Number(index) >>> 0] ?? null;
    traceCall("window.HTMLCollection.prototype.item", "HTMLCollection", [index], result);
    return result;
  },
}.item;
registerNativeFunction(item, "item");
export function installHTMLCollectionItem() {
  definePrototypeMethod(HTMLCollection.prototype, "item", item);
}
