import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireCSSStyleSheet } from "./css-style-sheet-state.js";

export function cssStyleSheetReadonlyDescriptor(name, read) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = read(requireCSSStyleSheet(this));
      traceGetter(`window.CSSStyleSheet.prototype.${name}`, "CSSStyleSheet", result);
      return result;
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  return descriptor;
}
