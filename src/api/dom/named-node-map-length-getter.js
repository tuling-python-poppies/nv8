import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { NamedNodeMap } from "./named-node-map-constructor.js";
import { refreshNamedNodeMap } from "./named-node-map-state.js";

export const length = Object.getOwnPropertyDescriptor({
  get length() {
    const value = refreshNamedNodeMap(this).length;
    traceGetter("window.NamedNodeMap.prototype.length", "NamedNodeMap", value);
    return value;
  },
}, "length").get;
registerNativeGetter(length, "length");
export function installNamedNodeMapLength() {
  definePrototypeGetter(NamedNodeMap.prototype, "length", length);
}
