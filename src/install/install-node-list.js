import {
  installNodeListConstructor,
  installNodeListConstructorBacklink,
  installNodeListToStringTag,
  NodeList,
} from "../api/dom/node-list-constructor.js";
import { installNodeListEntries } from "../api/dom/node-list-entries.js";
import { installNodeListForEach } from "../api/dom/node-list-for-each.js";
import { installNodeListItem } from "../api/dom/node-list-item.js";
import { installNodeListKeys } from "../api/dom/node-list-keys.js";
import { installNodeListLength } from "../api/dom/node-list-length-getter.js";
import {
  installNodeListValues,
  values,
} from "../api/dom/node-list-values.js";

export function installNodeList() {
  installNodeListConstructor();
  installNodeListEntries();
  installNodeListKeys();
  installNodeListValues();
  installNodeListForEach();
  installNodeListLength();
  installNodeListItem();
  installNodeListConstructorBacklink();
  installNodeListToStringTag();
  Object.defineProperty(NodeList.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
