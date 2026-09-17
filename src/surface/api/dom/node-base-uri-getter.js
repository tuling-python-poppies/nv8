import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Node } from "./node-constructor.js";
import { baseURIValue } from "./node-getters.js";

const baseURI = Object.getOwnPropertyDescriptor({
  get baseURI() {
    const value = baseURIValue(this);
    traceGetter("window.Node.prototype.baseURI", "Node", value);
    return value;
  },
}, "baseURI").get;
registerNativeGetter(baseURI, "baseURI");
export function installNodeBaseURI() {
  definePrototypeGetter(Node.prototype, "baseURI", baseURI);
}
