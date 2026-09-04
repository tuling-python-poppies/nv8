import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const defaultViewSlot = createRealmSlot(() => ({
  view: null,
}), "defaultView");

function defaultViewState() {
  return defaultViewSlot.get(globalThis);
}

export function configureDocumentDefaultView(value) {
  defaultViewState().view = value;
}

export function documentDefaultView() {
  return defaultViewState().view ?? globalThis;
}
