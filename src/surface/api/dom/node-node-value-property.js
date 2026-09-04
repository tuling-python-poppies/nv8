import { definePrototypeAccessor } from "../../../engine/webidl/descriptor.js";
import { Node } from "./node-constructor.js";
import { nodeValue } from "./node-node-value-getter.js";
import { setNodeValueCallback } from "./node-node-value-setter.js";

export function installNodeValue() {
  definePrototypeAccessor(
    Node.prototype,
    "nodeValue",
    nodeValue,
    setNodeValueCallback,
  );
}
