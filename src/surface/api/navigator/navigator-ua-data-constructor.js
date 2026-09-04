import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function NavigatorUAData() {
  throw new TypeError(
    "Failed to construct 'NavigatorUAData': Illegal constructor",
  );
}

registerNativeFunction(NavigatorUAData, "NavigatorUAData");

export function installNavigatorUADataConstructor() {
  delete NavigatorUAData.prototype.constructor;
  defineToStringTag(NavigatorUAData.prototype, "NavigatorUAData");
  defineGlobalConstructor("NavigatorUAData", NavigatorUAData);
}

export function installNavigatorUADataConstructorBacklink() {
  defineConstructorBacklink(NavigatorUAData.prototype, NavigatorUAData);
}
