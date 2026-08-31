import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { insertNode, requireNode, setNodeValue } from "./node-state.js";
import { createText, Text } from "./text-constructor.js";

export const splitText = {
  splitText(offset) {
    const state = requireNode(this);
    const index = Number(offset) >>> 0;
    const data = state.nodeValue ?? "";
    if (index > data.length) {
      throw new DOMException("The offset is larger than the data length.", "IndexSizeError");
    }
    const result = createText(data.slice(index), state.ownerDocument);
    setNodeValue(this, data.slice(0, index));
    if (state.parent !== null) {
      const siblings = requireNode(state.parent).children;
      insertNode(state.parent, result, siblings[siblings.indexOf(this) + 1] ?? null);
    }
    traceCall("window.Text.prototype.splitText", "Text", [offset], result);
    return result;
  },
}.splitText;
registerNativeFunction(splitText, "splitText");
export function installTextSplitText() {
  definePrototypeMethod(Text.prototype, "splitText", splitText);
}
