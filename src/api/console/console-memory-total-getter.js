import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireMemoryInfo } from "./console-memory-state.js";

export const totalJSHeapSize = Object.getOwnPropertyDescriptor({
  get totalJSHeapSize() {
    requireMemoryInfo(this);
    return 10_000_000;
  },
}, "totalJSHeapSize").get;
registerNativeGetter(totalJSHeapSize, "totalJSHeapSize");
