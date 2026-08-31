import {
  defineConstructorBacklink,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { addPath } from "../api/canvas/path-2d-add-path.js";
import { arc } from "../api/canvas/path-2d-arc.js";
import { arcTo } from "../api/canvas/path-2d-arc-to.js";
import { bezierCurveTo } from "../api/canvas/path-2d-bezier-curve-to.js";
import { closePath } from "../api/canvas/path-2d-close-path.js";
import {
  Path2D,
  installPath2DConstructor,
} from "../api/canvas/path-2d-constructor.js";
import { ellipse } from "../api/canvas/path-2d-ellipse.js";
import { lineTo } from "../api/canvas/path-2d-line-to.js";
import { moveTo } from "../api/canvas/path-2d-move-to.js";
import { quadraticCurveTo } from "../api/canvas/path-2d-quadratic-curve-to.js";
import { rect } from "../api/canvas/path-2d-rect.js";
import { roundRect } from "../api/canvas/path-2d-round-rect.js";

export function installPath2D() {
  installPath2DConstructor();
  method("addPath", addPath);
  method("roundRect", roundRect);
  method("arc", arc);
  method("arcTo", arcTo);
  method("bezierCurveTo", bezierCurveTo);
  method("closePath", closePath);
  method("ellipse", ellipse);
  method("lineTo", lineTo);
  method("moveTo", moveTo);
  method("quadraticCurveTo", quadraticCurveTo);
  method("rect", rect);
  defineConstructorBacklink(Path2D.prototype, Path2D);
  defineToStringTag(Path2D.prototype, "Path2D");
}

function method(name, callback) {
  definePrototypeMethod(Path2D.prototype, name, callback);
}
