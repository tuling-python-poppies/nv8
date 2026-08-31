import { createNodeList } from "./node-list-state.js";
import { RadioNodeList } from "./radio-node-list-constructor.js";

export function createRadioNodeList(source) {
  const list = createNodeList(source, true);
  Object.setPrototypeOf(list, RadioNodeList.prototype);
  return list;
}
