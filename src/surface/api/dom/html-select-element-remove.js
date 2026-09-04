import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireSelect } from "./html-select-element-state.js";
export const remove = {
  remove() {
    const options = requireSelect(this).options;
    if (arguments[0] === undefined) {
      const parent = this.parentNode;
      if (parent !== null) {
        parent.removeChild(this);
      }
    } else {
      options.remove(arguments[0]);
    }
    traceCall("window.HTMLSelectElement.prototype.remove", "HTMLSelectElement", [...arguments], undefined);
  },
}.remove;
registerNativeFunction(remove, "remove");
