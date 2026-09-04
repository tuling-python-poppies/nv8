import {
  defineConstructorBacklink,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CanvasPattern,
  installCanvasPatternConstructor,
} from "../api/canvas/canvas-pattern-constructor.js";
import { setTransform } from "../api/canvas/canvas-pattern-set-transform.js";

export function installCanvasPattern() {
  installCanvasPatternConstructor();
  definePrototypeMethod(CanvasPattern.prototype, "setTransform", setTransform);
  defineConstructorBacklink(CanvasPattern.prototype, CanvasPattern);
  defineToStringTag(CanvasPattern.prototype, "CanvasPattern");
}
