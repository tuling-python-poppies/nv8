import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireHTMLOptionsCollection, selectOptions } from "./html-options-collection-state.js";

export const add = {
  add(element) {
    const { select } = requireHTMLOptionsCollection(this);
    if (element?.localName !== "option" && element?.localName !== "optgroup") {
      throw new TypeError("The provided value is not an option or optgroup.");
    }
    const before = arguments[1];
    if (before === undefined || before === null) {
      select.append(element);
    } else if (typeof before === "number") {
      const reference = selectOptions(select)[Number(before) >>> 0] ?? null;
      (reference?.parentNode ?? select).insertBefore(element, reference);
    } else {
      (before.parentNode ?? select).insertBefore(element, before);
    }
    traceCall("window.HTMLOptionsCollection.prototype.add", "HTMLOptionsCollection", [...arguments], undefined);
  },
}.add;
registerNativeFunction(add, "add");
