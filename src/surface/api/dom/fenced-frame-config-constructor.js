import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function FencedFrameConfig() {
  throw new TypeError(
    "Failed to construct 'FencedFrameConfig': Illegal constructor",
  );
}
registerNativeFunction(FencedFrameConfig, "FencedFrameConfig");

export function installFencedFrameConfigConstructor() {
  delete FencedFrameConfig.prototype.constructor;
  defineGlobalConstructor("FencedFrameConfig", FencedFrameConfig);
}
