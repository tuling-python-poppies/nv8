import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireHTMLOptionsCollection, selectOptions } from "./html-options-collection-state.js";

export const remove = {
  remove(index) {
    const { select } = requireHTMLOptionsCollection(this);
    selectOptions(select)[Number(index) >>> 0]?.remove();
    traceCall("window.HTMLOptionsCollection.prototype.remove", "HTMLOptionsCollection", [index], undefined);
  },
}.remove;
registerNativeFunction(remove, "remove");
