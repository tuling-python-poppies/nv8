import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const pdfViewerEnabled = Object.getOwnPropertyDescriptor({
  get pdfViewerEnabled() {
    const value = navigatorField(this, "pdfViewerEnabled");
    traceGetter(
      "window.Navigator.prototype.pdfViewerEnabled",
      "Navigator",
      value,
    );
    return value;
  },
}, "pdfViewerEnabled").get;
registerNativeGetter(pdfViewerEnabled, "pdfViewerEnabled");
export function installNavigatorPdfViewerEnabled() {
  definePrototypeGetter(
    Navigator.prototype,
    "pdfViewerEnabled",
    pdfViewerEnabled,
  );
}
