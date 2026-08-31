import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { htmlAllNamedItem } from "./html-all-collection-state.js";

export const namedItem = {
  namedItem(name) {
    const result = htmlAllNamedItem(this, name);
    traceCall(
      "window.HTMLAllCollection.prototype.namedItem",
      "HTMLAllCollection",
      [name],
      result,
    );
    return result;
  },
}.namedItem;
registerNativeFunction(namedItem, "namedItem");
