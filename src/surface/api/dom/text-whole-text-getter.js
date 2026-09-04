import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireNode } from "./node-state.js";
import { Text } from "./text-constructor.js";

export const wholeText = Object.getOwnPropertyDescriptor({
  get wholeText() {
    const state = requireNode(this);
    let value = state.nodeValue ?? "";
    if (state.parent !== null) {
      const siblings = requireNode(state.parent).children;
      const ownIndex = siblings.indexOf(this);
      let start = ownIndex - 1;
      while (start >= 0 && requireNode(siblings[start]).nodeType === 3) {
        value = `${requireNode(siblings[start]).nodeValue ?? ""}${value}`;
        start -= 1;
      }
      let end = ownIndex + 1;
      while (end < siblings.length && requireNode(siblings[end]).nodeType === 3) {
        value += requireNode(siblings[end]).nodeValue ?? "";
        end += 1;
      }
    }
    traceGetter("window.Text.prototype.wholeText", "Text", value);
    return value;
  },
}, "wholeText").get;
registerNativeGetter(wholeText, "wholeText");
export function installTextWholeText() {
  definePrototypeGetter(Text.prototype, "wholeText", wholeText);
}
