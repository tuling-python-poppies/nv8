import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireLocation } from "./location-state.js";

const ancestorOrigins = Object.freeze([]);

export const locationAncestorOrigins = Object.getOwnPropertyDescriptor({
  get ancestorOrigins() {
    requireLocation(this);
    traceGetter(
      "window.location.ancestorOrigins",
      "Location",
      ancestorOrigins,
    );
    return ancestorOrigins;
  },
}, "ancestorOrigins").get;

registerNativeGetter(locationAncestorOrigins, "ancestorOrigins");
