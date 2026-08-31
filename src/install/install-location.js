import { installLocationConstructor } from "../api/location/location-constructor.js";
import {
  globalLocation as getter,
} from "../api/location/location-global-getter.js";
import {
  globalLocation as setter,
} from "../api/location/location-global-setter.js";
import { installLocationInstance } from "../api/location/location-instance.js";

export function installLocation() {
  installLocationConstructor();
  installLocationInstance();
  Object.defineProperty(globalThis, "location", {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}
