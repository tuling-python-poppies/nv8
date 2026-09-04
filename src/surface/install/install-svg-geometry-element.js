import {
  finishSVGGeometryElementConstructor,
  installSVGGeometryElementConstructor,
  SVGGeometryElement,
} from "../api/dom/svg-geometry-element-constructor.js";
import {
  definePrototypeGetter,
  definePrototypeMethod,
} from "../../engine/webidl/descriptor.js";
import {
  getPointAtLength,
  getTotalLength,
  isPointInFill,
  isPointInStroke,
  pathLength,
} from "../api/svg/svg-geometry-element-members.js";

export function installSVGGeometryElement() {
  installSVGGeometryElementConstructor();
  definePrototypeGetter(SVGGeometryElement.prototype, "pathLength", pathLength);
  definePrototypeMethod(
    SVGGeometryElement.prototype,
    "getPointAtLength",
    getPointAtLength,
  );
  definePrototypeMethod(
    SVGGeometryElement.prototype,
    "getTotalLength",
    getTotalLength,
  );
  definePrototypeMethod(
    SVGGeometryElement.prototype,
    "isPointInFill",
    isPointInFill,
  );
  definePrototypeMethod(
    SVGGeometryElement.prototype,
    "isPointInStroke",
    isPointInStroke,
  );
  finishSVGGeometryElementConstructor();
}
