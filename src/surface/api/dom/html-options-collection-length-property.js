import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { refreshHTMLCollection } from "./html-collection-state.js";
import { requireHTMLOptionsCollection } from "./html-options-collection-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get length() {
    requireHTMLOptionsCollection(this);
    const result = refreshHTMLCollection(this).length;
    traceGetter("window.HTMLOptionsCollection.prototype.length", "HTMLOptionsCollection", result);
    return result;
  },
  set length(value) {
    const { select } = requireHTMLOptionsCollection(this);
    const desired = Number(value) >>> 0;
    const options = refreshHTMLCollection(this);
    if (desired < options.length) {
      for (let index = options.length - 1; index >= desired; index -= 1) {
        options[index].remove();
      }
    } else {
      for (let index = options.length; index < desired; index += 1) {
        select.append(select.ownerDocument.createElement("option"));
      }
    }
  },
}, "length");
export const length = descriptor.get;
export const setLength = descriptor.set;
registerNativeGetter(length, "length");
registerNativeFunction(setLength, "set length");
