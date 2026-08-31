import {
  finishNamedNodeMapConstructor,
  installNamedNodeMapConstructor,
} from "../api/dom/named-node-map-constructor.js";
import {
  installNamedNodeMapGetNamedItem,
} from "../api/dom/named-node-map-get-named-item.js";
import {
  installNamedNodeMapGetNamedItemNS,
} from "../api/dom/named-node-map-get-named-item-ns.js";
import { installNamedNodeMapItem } from "../api/dom/named-node-map-item.js";
import {
  installNamedNodeMapLength,
} from "../api/dom/named-node-map-length-getter.js";
import {
  installNamedNodeMapRemoveNamedItem,
} from "../api/dom/named-node-map-remove-named-item.js";
import {
  installNamedNodeMapRemoveNamedItemNS,
} from "../api/dom/named-node-map-remove-named-item-ns.js";
import {
  installNamedNodeMapSetNamedItem,
} from "../api/dom/named-node-map-set-named-item.js";
import {
  installNamedNodeMapSetNamedItemNS,
} from "../api/dom/named-node-map-set-named-item-ns.js";
import {
  installNamedNodeMapIterator,
} from "../api/dom/named-node-map-values.js";

export function installNamedNodeMap() {
  installNamedNodeMapConstructor();
  installNamedNodeMapLength();
  installNamedNodeMapGetNamedItem();
  installNamedNodeMapGetNamedItemNS();
  installNamedNodeMapItem();
  installNamedNodeMapRemoveNamedItem();
  installNamedNodeMapRemoveNamedItemNS();
  installNamedNodeMapSetNamedItem();
  installNamedNodeMapSetNamedItemNS();
  finishNamedNodeMapConstructor();
  installNamedNodeMapIterator();
}
