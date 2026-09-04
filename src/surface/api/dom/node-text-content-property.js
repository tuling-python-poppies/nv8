import { definePrototypeAccessor } from "../../../engine/webidl/descriptor.js";
import { Node } from "./node-constructor.js";
import { textContent } from "./node-text-content-getter.js";
import { setTextContent } from "./node-text-content-setter.js";

export function installNodeTextContent() {
  definePrototypeAccessor(
    Node.prototype,
    "textContent",
    textContent,
    setTextContent,
  );
}
