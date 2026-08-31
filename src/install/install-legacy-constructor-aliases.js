import { DOMMatrix } from "../api/geometry/dom-matrix-constructor.js";
import { MediaStream } from "../api/media/media-stream-constructor.js";
import { defineGlobalConstructor } from "../webidl/descriptor.js";

export function installLegacyConstructorAliases() {
  defineGlobalConstructor("WebKitCSSMatrix", DOMMatrix);
  defineGlobalConstructor("webkitMediaStream", MediaStream);
}
