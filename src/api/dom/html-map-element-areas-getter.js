import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";

const areaCollections = new WeakMap();

export const areas = Object.getOwnPropertyDescriptor({
  get areas() {
    requireElement(this);
    let result = areaCollections.get(this);
    if (result === undefined) {
      result = this.getElementsByTagName("area");
      areaCollections.set(this, result);
    }
    traceGetter(
      "window.HTMLMapElement.prototype.areas",
      "HTMLMapElement",
      result,
    );
    return result;
  },
}, "areas").get;
registerNativeGetter(areas, "areas");
