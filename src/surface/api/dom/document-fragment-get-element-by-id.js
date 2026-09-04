import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { descendants, requireNode } from "./node-state.js";

export const getElementById = {
  getElementById(id) {
    requireNode(this);
    const name = `${id}`;
    const result = descendants(this).find(
      node => requireNode(node).nodeType === 1 && node.getAttribute("id") === name,
    ) ?? null;
    traceCall("window.DocumentFragment.prototype.getElementById", "DocumentFragment", [id], result);
    return result;
  },
}.getElementById;
registerNativeFunction(getElementById, "getElementById");
