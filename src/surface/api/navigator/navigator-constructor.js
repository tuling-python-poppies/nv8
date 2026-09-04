import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function Navigator() {
  throw new TypeError("Failed to construct 'Navigator': Illegal constructor");
}

registerNativeFunction(Navigator, "Navigator");

export function installNavigatorConstructor() {
  delete Navigator.prototype.constructor;
  defineToStringTag(Navigator.prototype, "Navigator");
  defineGlobalConstructor("Navigator", Navigator);
}

export function installNavigatorConstructorBacklink() {
  defineConstructorBacklink(Navigator.prototype, Navigator);
}
