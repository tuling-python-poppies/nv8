import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { ScreenOrientation } from "./screen-orientation-constructor.js";
import { requireScreenOrientation } from "./screen-orientation-state.js";

export const screenOrientationAngle = Object.getOwnPropertyDescriptor({
  get angle() {
    const value = requireScreenOrientation(this).angle;
    traceGetter("window.ScreenOrientation.prototype.angle", "ScreenOrientation", value);
    return value;
  },
}, "angle").get;

registerNativeGetter(screenOrientationAngle, "angle");

export function installScreenOrientationAngle() {
  definePrototypeGetter(
    ScreenOrientation.prototype,
    "angle",
    screenOrientationAngle,
  );
}
