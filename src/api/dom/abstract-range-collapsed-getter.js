import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireRange } from "./range-state.js";

export const collapsed = Object.getOwnPropertyDescriptor({
  get collapsed() {
    const state = requireRange(this);
    const value = state.startContainer === state.endContainer
      && state.startOffset === state.endOffset;
    traceGetter("window.AbstractRange.prototype.collapsed", "AbstractRange", value);
    return value;
  },
}, "collapsed").get;
registerNativeGetter(collapsed, "collapsed");
