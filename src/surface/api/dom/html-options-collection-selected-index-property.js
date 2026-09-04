import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireHTMLOptionsCollection } from "./html-options-collection-state.js";
import {
  selectSelectedIndex,
  setSelectSelectedIndex,
} from "./html-select-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get selectedIndex() {
    const { select } = requireHTMLOptionsCollection(this);
    const result = selectSelectedIndex(select);
    traceGetter("window.HTMLOptionsCollection.prototype.selectedIndex", "HTMLOptionsCollection", result);
    return result;
  },
  set selectedIndex(value) {
    const { select } = requireHTMLOptionsCollection(this);
    setSelectSelectedIndex(select, value);
  },
}, "selectedIndex");
export const selectedIndex = descriptor.get;
export const setSelectedIndex = descriptor.set;
registerNativeGetter(selectedIndex, "selectedIndex");
registerNativeFunction(setSelectedIndex, "set selectedIndex");
