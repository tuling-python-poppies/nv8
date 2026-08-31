import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { htmlAllItems } from "./html-all-collection-state.js";

export const length = Object.getOwnPropertyDescriptor({
  get length() {
    const result = htmlAllItems(this).length;
    traceGetter(
      "window.HTMLAllCollection.prototype.length",
      "HTMLAllCollection",
      result,
    );
    return result;
  },
}, "length").get;
registerNativeGetter(length, "length");
