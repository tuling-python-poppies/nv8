import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireTemplate } from "./html-template-element-state.js";

export const content = Object.getOwnPropertyDescriptor({
  get content() {
    const result = requireTemplate(this).content;
    traceGetter(
      "window.HTMLTemplateElement.prototype.content",
      "HTMLTemplateElement",
      result,
    );
    return result;
  },
}, "content").get;
registerNativeGetter(content, "content");
