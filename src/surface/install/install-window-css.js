import { defineGlobalFunction } from "../../engine/webidl/descriptor.js";
import { getComputedStyle } from "../api/css/get-computed-style-global.js";
import { matchMedia } from "../api/css/match-media-global.js";

export function installWindowCSS() {
  defineGlobalFunction("getComputedStyle", getComputedStyle);
  defineGlobalFunction("matchMedia", matchMedia);
}
