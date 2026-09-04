import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { htmlAllItem } from "./html-all-collection-state.js";

export const item = {
  item() {
    const result = htmlAllItem(this, arguments[0]);
    traceCall(
      "window.HTMLAllCollection.prototype.item",
      "HTMLAllCollection",
      [arguments[0]],
      result,
    );
    return result;
  },
}.item;
registerNativeFunction(item, "item");
