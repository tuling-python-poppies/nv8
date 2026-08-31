import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireTextTrack } from "./text-track-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get oncuechange() {
    const result = requireTextTrack(this).oncuechange;
    traceGetter("window.TextTrack.prototype.oncuechange", "TextTrack", result);
    return result;
  },
  set oncuechange(value) {
    requireTextTrack(this).oncuechange =
      value === null || value === undefined ? null : value;
  },
}, "oncuechange");
export const oncuechange = descriptor.get;
export const setOncuechange = descriptor.set;
registerNativeGetter(oncuechange, "oncuechange");
registerNativeFunction(setOncuechange, "set oncuechange");
