import { definePrototypeAccessor } from "../../../engine/webidl/descriptor.js";
import { Screen } from "./screen-constructor.js";
import { screenOnchange as getter } from "./screen-onchange-getter.js";
import { screenOnchange as setter } from "./screen-onchange-setter.js";

export function installScreenOnchange() {
  definePrototypeAccessor(Screen.prototype, "onchange", getter, setter);
}
