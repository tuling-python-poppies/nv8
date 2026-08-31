import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Node } from "./node-constructor.js";
import { ownerDocumentValue } from "./node-getters.js";

export const ownerDocument = Object.getOwnPropertyDescriptor({
  get ownerDocument() {
    const value = ownerDocumentValue(this);
    traceGetter("window.Node.prototype.ownerDocument", "Node", value);
    return value;
  },
}, "ownerDocument").get;
registerNativeGetter(ownerDocument, "ownerDocument");
export function installNodeOwnerDocument() {
  definePrototypeGetter(Node.prototype, "ownerDocument", ownerDocument);
}
