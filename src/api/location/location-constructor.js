import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function Location() {
  throw new TypeError("Failed to construct 'Location': Illegal constructor");
}

registerNativeFunction(Location, "Location");

export function installLocationConstructor() {
  delete Location.prototype.constructor;
  defineToStringTag(Location.prototype, "Location");
  defineGlobalConstructor("Location", Location);
  defineConstructorBacklink(Location.prototype, Location);
}
