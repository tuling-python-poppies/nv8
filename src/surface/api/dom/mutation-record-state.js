import { createNodeList } from "./node-list-state.js";
import { MutationRecord } from "./mutation-record-constructor.js";

const recordState = new WeakMap();

export function createMutationRecord(record, options) {
  const value = Object.create(MutationRecord.prototype);
  recordState.set(value, {
    type: record.type,
    target: record.target,
    addedNodes: createNodeList(() => record.addedNodes ?? [], false),
    removedNodes: createNodeList(() => record.removedNodes ?? [], false),
    previousSibling: record.previousSibling ?? null,
    nextSibling: record.nextSibling ?? null,
    attributeName: record.attributeName ?? null,
    attributeNamespace: record.attributeNamespace ?? null,
    oldValue: (
      (record.type === "attributes" && options.attributeOldValue)
      || (record.type === "characterData" && options.characterDataOldValue)
    ) ? (record.oldValue ?? null) : null,
  });
  return value;
}

export function requireMutationRecord(value) {
  const state = recordState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}
