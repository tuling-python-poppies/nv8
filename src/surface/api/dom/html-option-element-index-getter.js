import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { descendants } from "./node-state.js";
export const index = Object.getOwnPropertyDescriptor({
  get index() {
    requireElement(this);
    const select = this.closest("select");
    const result = select === null
      ? -1
      : descendants(select).filter(node => node.localName === "option").indexOf(this);
    traceGetter("window.HTMLOptionElement.prototype.index", "HTMLOptionElement", result);
    return result;
  },
}, "index").get;
registerNativeGetter(index, "index");
