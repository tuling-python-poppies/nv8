import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { serializeChildren } from "./html-serializer.js";
import {
  isTemplate,
  requireTemplate,
} from "./html-template-element-state.js";

export const innerHTML = Object.getOwnPropertyDescriptor({
  get innerHTML() {
    requireElement(this);
    const value = serializeChildren(
      isTemplate(this) ? requireTemplate(this).content : this,
    );
    traceGetter("window.Element.prototype.innerHTML", "Element", value);
    return value;
  },
}, "innerHTML").get;
registerNativeGetter(innerHTML, "innerHTML");
