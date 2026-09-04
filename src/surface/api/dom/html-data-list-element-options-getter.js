import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";

const optionCollections = new WeakMap();

export const options = Object.getOwnPropertyDescriptor({
  get options() {
    requireElement(this);
    let result = optionCollections.get(this);
    if (result === undefined) {
      result = this.getElementsByTagName("option");
      optionCollections.set(this, result);
    }
    traceGetter(
      "window.HTMLDataListElement.prototype.options",
      "HTMLDataListElement",
      result,
    );
    return result;
  },
}, "options").get;
registerNativeGetter(options, "options");
