import { History } from "./history-constructor.js";

const historyState = new WeakSet();
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const historySlot = createRealmSlot(() => ({
  singleton: null,
}), "history");

function historyRealmState() {
  return historySlot.get(globalThis);
}

export function createHistory() {
  if (historyRealmState().singleton !== null) {
    return historyRealmState().singleton;
  }
  const value = Object.create(History.prototype);
  historyState.add(value);
  historyRealmState().singleton = value;
  return value;
}

export function requireHistory(value) {
  if (!historyState.has(value)) {
    throw new TypeError("Illegal invocation");
  }
}
