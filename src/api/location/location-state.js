import { Location } from "./location-constructor.js";

const locationState = new WeakSet();
import { createRealmSlot } from "../../core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const locationSlot = createRealmSlot(() => ({
  singleton: null,
}), "location");

function locationRealmState() {
  return locationSlot.get(globalThis);
}

export function createLocation() {
  if (locationRealmState().singleton !== null) {
    return locationRealmState().singleton;
  }
  const value = Object.create(Location.prototype);
  locationState.add(value);
  locationRealmState().singleton = value;
  return value;
}

export function requireLocation(value) {
  if (!locationState.has(value)) {
    throw new TypeError("Illegal invocation");
  }
}
