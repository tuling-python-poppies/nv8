import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { values } from "../api/dom/node-list-values.js";
import {
  RadioNodeList,
  installRadioNodeListConstructor,
} from "../api/dom/radio-node-list-constructor.js";
import {
  setValue,
  value,
} from "../api/dom/radio-node-list-value-property.js";

export function installRadioNodeList() {
  installRadioNodeListConstructor();
  definePrototypeAccessor(RadioNodeList.prototype, "value", value, setValue);
  defineConstructorBacklink(RadioNodeList.prototype, RadioNodeList);
  defineToStringTag(RadioNodeList.prototype, "RadioNodeList");
  Object.defineProperty(RadioNodeList.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
