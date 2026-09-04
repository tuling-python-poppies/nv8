import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { createHTMLCollection } from "./html-collection-state.js";
import { tableBodies } from "./html-table-element-state.js";

const bodyCollections = new WeakMap();
export const tBodies = Object.getOwnPropertyDescriptor({
  get tBodies() {
    requireElement(this);
    let result = bodyCollections.get(this);
    if (result === undefined) {
      result = createHTMLCollection(() => tableBodies(this));
      bodyCollections.set(this, result);
    }
    traceGetter("window.HTMLTableElement.prototype.tBodies", "HTMLTableElement", result);
    return result;
  },
}, "tBodies").get;
registerNativeGetter(tBodies, "tBodies");
