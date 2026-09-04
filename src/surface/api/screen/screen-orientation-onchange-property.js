import { definePrototypeAccessor } from "../../../engine/webidl/descriptor.js";
import { ScreenOrientation } from "./screen-orientation-constructor.js";
import {
  screenOrientationOnchange as getter,
} from "./screen-orientation-onchange-getter.js";
import {
  screenOrientationOnchange as setter,
} from "./screen-orientation-onchange-setter.js";

export function installScreenOrientationOnchange() {
  definePrototypeAccessor(
    ScreenOrientation.prototype,
    "onchange",
    getter,
    setter,
  );
}
