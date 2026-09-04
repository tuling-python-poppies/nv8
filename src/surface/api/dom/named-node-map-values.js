import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { NamedNodeMap } from "./named-node-map-constructor.js";
import { refreshNamedNodeMap } from "./named-node-map-state.js";

export const values = {
  values() {
    return refreshNamedNodeMap(this)[Symbol.iterator]();
  },
}.values;
registerNativeFunction(values, "values");

export function installNamedNodeMapIterator() {
  Object.defineProperty(NamedNodeMap.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
