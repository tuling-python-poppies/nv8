import {
  defineConstructorBacklink,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { addColorStop } from "../api/canvas/canvas-gradient-add-color-stop.js";
import {
  CanvasGradient,
  installCanvasGradientConstructor,
} from "../api/canvas/canvas-gradient-constructor.js";

export function installCanvasGradient() {
  installCanvasGradientConstructor();
  definePrototypeMethod(CanvasGradient.prototype, "addColorStop", addColorStop);
  defineConstructorBacklink(CanvasGradient.prototype, CanvasGradient);
  defineToStringTag(CanvasGradient.prototype, "CanvasGradient");
}
