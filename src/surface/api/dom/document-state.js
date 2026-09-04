import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const documentSlot = createRealmSlot(() => ({
  activeDocument: null,
}), "document");

function documentRealmState() {
  return documentSlot.get(globalThis);
}

export function setActiveDocument(document) {
  documentRealmState().activeDocument = document;
}

export function currentDocument() {
  return documentRealmState().activeDocument;
}
