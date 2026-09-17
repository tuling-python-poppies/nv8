import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { ScreenOrientation } from "./screen-orientation-constructor.js";
import { requireScreenOrientation } from "./screen-orientation-state.js";

const screenOrientationType = Object.getOwnPropertyDescriptor({
  get type() {
    const value = requireScreenOrientation(this).type;
    traceGetter("window.ScreenOrientation.prototype.type", "ScreenOrientation", value);
    return value;
  },
}, "type").get;

registerNativeGetter(screenOrientationType, "type");

export function installScreenOrientationType() {
  definePrototypeGetter(
    ScreenOrientation.prototype,
    "type",
    screenOrientationType,
  );
}
