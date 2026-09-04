import {
  definePrototypeGetter,
} from "../../engine/webidl/descriptor.js";
import {
  addedNodes,
} from "../api/dom/mutation-record-added-nodes-getter.js";
import {
  attributeName,
} from "../api/dom/mutation-record-attribute-name-getter.js";
import {
  attributeNamespace,
} from "../api/dom/mutation-record-attribute-namespace-getter.js";
import {
  finishMutationRecordConstructor,
  installMutationRecordConstructor,
  MutationRecord,
} from "../api/dom/mutation-record-constructor.js";
import {
  nextSibling,
} from "../api/dom/mutation-record-next-sibling-getter.js";
import {
  oldValue,
} from "../api/dom/mutation-record-old-value-getter.js";
import {
  previousSibling,
} from "../api/dom/mutation-record-previous-sibling-getter.js";
import {
  removedNodes,
} from "../api/dom/mutation-record-removed-nodes-getter.js";
import {
  target,
} from "../api/dom/mutation-record-target-getter.js";
import { type } from "../api/dom/mutation-record-type-getter.js";

export function installMutationRecord() {
  installMutationRecordConstructor();
  definePrototypeGetter(MutationRecord.prototype, "type", type);
  definePrototypeGetter(MutationRecord.prototype, "target", target);
  definePrototypeGetter(MutationRecord.prototype, "addedNodes", addedNodes);
  definePrototypeGetter(MutationRecord.prototype, "removedNodes", removedNodes);
  definePrototypeGetter(
    MutationRecord.prototype,
    "previousSibling",
    previousSibling,
  );
  definePrototypeGetter(MutationRecord.prototype, "nextSibling", nextSibling);
  definePrototypeGetter(MutationRecord.prototype, "attributeName", attributeName);
  definePrototypeGetter(
    MutationRecord.prototype,
    "attributeNamespace",
    attributeNamespace,
  );
  definePrototypeGetter(MutationRecord.prototype, "oldValue", oldValue);
  finishMutationRecordConstructor();
}
